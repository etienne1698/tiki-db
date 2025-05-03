import { PrimaryKey } from "drizzle-orm/gel-core";
import { CollectionSchema } from "../../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../../database/database";
import { Query, QueryFilters, QueryResult } from "../../query/query";
import { Relation } from "../../relation/relation";
import {
  Primary,
  AnyButMaybeT,
  InferModelFieldName,
  InferModelNormalizedType,
} from "../../types";
import { Storage } from "../storage";
import { InMemoryQueryFilter } from "./in_memory_query_filter";

export class InMemoryStorage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<DBFullSchema>
{
  stores: {
    [key in keyof DBFullSchema["schema"]]: Array<
      ReturnType<DBFullSchema["schemaDbName"][key]["model"]["normalize"]>
    >;
  } = {} as {
    [key in keyof DBFullSchema["schemaDbName"]]: Array<
      ReturnType<DBFullSchema["schemaDbName"][key]["model"]["normalize"]>
    >;
  };

  declare database: Database;

  async init(database: Database): Promise<void> {
    this.database = database;
    for (const collection of Object.values(database.schema.schema)) {
      // @ts-ignore
      this.stores[collection.model.dbName] = [];
    }
  }

  insert<C extends CollectionSchema>(
    collectionSchema: C,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    saveRelations?: boolean
  ): ReturnType<C["model"]["normalize"]> {
    const inserted = collectionSchema.model.normalize(data);
    if (saveRelations) {
      this.#saveRelations(collectionSchema, data);
    }
    this.stores[collectionSchema.model.dbName].push(
      inserted as ReturnType<C["model"]["normalize"]>
    );
    return inserted as ReturnType<C["model"]["normalize"]>;
  }

  insertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>[],
    saveRelations?: boolean
  ): ReturnType<C["model"]["normalize"]>[] {
    const allInserted: ReturnType<C["model"]["normalize"]>[] = [];
    for (const d of data) {
      const inserted = collectionSchema.model.normalize(d) as ReturnType<
        C["model"]["normalize"]
      >;
      if (saveRelations) {
        this.#saveRelations(collectionSchema, d);
      }
      this.stores[collectionSchema.model.dbName].push(inserted);
      allInserted.push(inserted);
    }
    return allInserted;
  }

  #getQueryFiltersByPrimary<C extends CollectionSchema>(
    collectionSchema: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>
  ) {
    const primary = collectionSchema.model.primary(data);
    return {
      [collectionSchema.model.primaryKey as InferModelFieldName<C["model"]>]: {
        $eq: primary,
      },
    } as QueryFilters<C>;
  }

  #getQueryFiltersByPrimaries<C extends CollectionSchema>(
    collectionSchema: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>[]
  ) {
    const primaries = data.reduce((prev, current) => {
      const primary = collectionSchema.model.primary(current);
      prev.push(primary);
      return prev;
    }, [] as Primary[]);
    return {
      [collectionSchema.model.primaryKey as InferModelFieldName<C["model"]>]: {
        $in: primaries,
      },
    } as QueryFilters<C>;
  }

  upsert<C extends CollectionSchema>(
    collectionSchema: C,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    saveRelations?: boolean
  ): ReturnType<C["model"]["normalize"]> | undefined {
    const queryFilters = this.#getQueryFiltersByPrimary(collectionSchema, data);
    const found = this.findFirst(collectionSchema, {
      filters: queryFilters,
    });
    if (found) {
      return this.update(collectionSchema, queryFilters, data);
    }
    return this.insert(collectionSchema, data, saveRelations);
  }

  upsertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>[],
    saveRelations?: boolean
  ): ReturnType<C["model"]["normalize"]>[] {
    return data.reduce((prev, current) => {
      const res = this.upsert(collectionSchema, current, saveRelations);
      if (res) prev.push(res);
      return prev;
    }, []) as ReturnType<C["model"]["normalize"]>[];
  }

  findMany<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collectionSchema: C,
    query?: Q | undefined
  ): QueryResult<C, DBFullSchema, Q> {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C, Q>(query);
    const res = filtersManager.apply(
      this.stores[collectionSchema.model.dbName]
    );
    if (query?.with) {
      return res.map((data) =>
        this.#getDataWithRelations(collectionSchema, query, data)
      );
    }
    return res;
  }

  findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collectionSchema: C, query?: Q | undefined) {
    return this.findMany(collectionSchema, query)?.[0];
  }

  remove<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>
  ): void {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C>({
      filters: queryFilters,
    });
    // @ts-ignore
    this.stores[collectionSchema.model.dbName] = this.stores[
      collectionSchema.model.dbName
    ].filter((d) => !filtersManager.filter(d));
  }

  update<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>
  ): ReturnType<C["model"]["normalize"]> | undefined {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C>({
      filters: queryFilters,
    });
    const index = this.stores[collectionSchema.model.dbName].findIndex(
      filtersManager.filter.bind(filtersManager)
    );
    this.stores[collectionSchema.model.dbName][index] = {
      ...this.stores[collectionSchema.model.dbName][index],
      ...data,
    };
    return this.stores[collectionSchema.model.dbName][index];
  }

  updateMany<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>
  ): ReturnType<C["model"]["normalize"]>[] {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C>({
      filters: queryFilters,
    });
    // @ts-ignore
    return (this.stores[collectionSchema.model.dbName] = this.stores[
      collectionSchema.model.dbName
    ].reduce((prev, current, currentIndex) => {
      if (!filtersManager.filter(current)) return prev;
      const updated = {
        ...this.stores[collectionSchema.model.dbName][currentIndex],
        ...data,
      } as InferModelNormalizedType<C["model"]>;
      this.stores[collectionSchema.model.dbName][currentIndex] = updated;
      prev.push(updated);
      return prev;
    }, [] as InferModelNormalizedType<C["model"]>[]));
  }

  #getRelationQuery<C extends CollectionSchema>(
    collectionSchema: C,
    relation: Relation,
    data: any
  ): Query<any, any> {
    const filters: Query<any, any>["filters"] = {};
    for (const fieldIndex in relation.fields) {
      filters[relation.references[fieldIndex]] = {
        $eq: data[relation.fields[fieldIndex]],
      };
    }

    return {
      filters,
    };
  }

  #getDataWithRelations<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collectionSchema: C, query: Q | undefined, data: any) {
    if (!query?.with) return;
    for (const [relationKey, relationQueryOrBoolean] of Object.entries(
      query.with
    )) {
      if (!relationQueryOrBoolean) return data;
      const relation = collectionSchema.relations.schema[relationKey];

      const relationCollectionSchema =
        this.database.schema.schemaDbName[relation.related.dbName];

      const relationQuery = this.#getRelationQuery(
        collectionSchema,
        relation,
        data
      );
      if (typeof relationQueryOrBoolean !== "boolean") {
        relationQuery.filters = {
          ...(relationQueryOrBoolean?.filters || {}),
          ...relationQuery.filters,
        };
      }
      data[relationKey] = this[relation.multiple ? "findMany" : "findFirst"](
        relationCollectionSchema,
        relationQuery as Query<typeof relationCollectionSchema, DBFullSchema>
      );
    }
    return data;
  }

  #saveRelations<C extends CollectionSchema>(collectionSchema: C, data: any) {
    for (const relationKey in collectionSchema.relations.schema) {
      if (!data?.[relationKey]) continue;

      const relation = collectionSchema.relations.schema[relationKey];
      const relationCollectionSchemaSchema =
        this.database.schema.schemaDbName[relation.related.dbName];

      if (Array.isArray(data[relationKey])) {
        if (relation.multiple) {
          this.upsertMany(relationCollectionSchemaSchema, data[relationKey]);
        }
      } else {
        this.upsert(relationCollectionSchemaSchema, data[relationKey]);
      }
    }
  }
}
