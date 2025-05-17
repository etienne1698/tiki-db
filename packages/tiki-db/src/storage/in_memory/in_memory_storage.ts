import { CollectionSchema } from "../../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../../database/database";
import { Query, QueryFilters, QueryResult } from "../../query/query";
import { Relation } from "../../relation/relation";
import {
  AnyButMaybeT,
  InferModelFieldName,
  InferModelNormalizedType,
  InferCollectionInsert,
  InferCollectionUpdate,
  InferModelNormalizedInDatabaseType,
} from "../../types";
import { Storage } from "../storage";
import { InMemoryQueryFilter } from "../helpers/in_memory_query_filter";
import { mapQueryForDBFields } from "../helpers/database_query_mapper";

export class InMemoryStorage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<DBFullSchema>
{
  stores: {
    [key in keyof DBFullSchema["schemaDbName"]]: Array<
      InferModelNormalizedInDatabaseType<
        DBFullSchema["schemaDbName"][key]["model"]
      >
    >;
  } = {} as {
    [key in keyof DBFullSchema["schemaDbName"]]: Array<
      InferModelNormalizedInDatabaseType<
        DBFullSchema["schemaDbName"][key]["model"]
      >
    >;
  };

  clear<C extends CollectionSchema>(collectionSchema: C) {
    // @ts-ignore
    this.stores[collectionSchema.model.dbName] = [];
  }

  clearAll() {
    for (const collection of Object.values(this.database.schema.schema)) {
      // @ts-ignore
      this.stores[collection.model.dbName] = [];
    }
  }

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
    data: InferCollectionInsert<C, DBFullSchema>,
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]> {
    const inserted = collectionSchema.model.mapToDB(data);
    if (saveRelations) {
      this.#saveRelations(collectionSchema, data);
    }
    this.stores[collectionSchema.model.dbName].push(inserted);
    return data;
  }

  insertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionInsert<C, DBFullSchema>[],
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]>[] {
    const allInserted: InferModelNormalizedType<C["model"]>[] = [];
    for (const d of data) {
      const inserted = collectionSchema.model.mapToDB(d);
      if (saveRelations) {
        this.#saveRelations(collectionSchema, d);
      }
      this.stores[collectionSchema.model.dbName].push(inserted);
      allInserted.push(d);
    }
    return allInserted;
  }

  upsert<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>,
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]> | undefined {
    const queryFilters = collectionSchema.model.getFilterByPrimary<C>(data);
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
    data: InferCollectionUpdate<C, DBFullSchema>[],
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]>[] {
    return data.reduce((prev, current) => {
      const res = this.upsert(collectionSchema, current, saveRelations);
      if (res) prev.push(res);
      return prev;
    }, [] as InferModelNormalizedType<C["model"]>[]) as InferModelNormalizedType<
      C["model"]
    >[];
  }

  findMany<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collectionSchema: C,
    query?: Q | undefined
  ): QueryResult<C, DBFullSchema, Q> {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C, Q>(
      mapQueryForDBFields(collectionSchema, query)
    );
    let res = filtersManager.apply(this.stores[collectionSchema.model.dbName]);
    if (query?.with) {
      res = res.map((data) =>
        this.#getDataWithRelations(collectionSchema, query, data)
      );
    }
    return res.map(
      collectionSchema.model.mapFromDB.bind(collectionSchema.model)
    );
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
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C>(
      mapQueryForDBFields(collectionSchema, {
        filters: queryFilters,
      })
    );
    // @ts-ignore
    this.stores[collectionSchema.model.dbName] = this.stores[
      collectionSchema.model.dbName
    ].filter((d) => !filtersManager.filter(d));
  }

  update<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): InferModelNormalizedType<C["model"]> | undefined {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C>(
      mapQueryForDBFields(collectionSchema, {
        filters: queryFilters,
      })
    );
    const index = this.stores[collectionSchema.model.dbName].findIndex(
      filtersManager.filter.bind(filtersManager)
    );
    this.stores[collectionSchema.model.dbName][index] = {
      ...this.stores[collectionSchema.model.dbName][index],
      ...collectionSchema.model.mapToDB(data),
    };
    return collectionSchema.model.mapFromDB(
      this.stores[collectionSchema.model.dbName][index]
    );
  }

  updateMany<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): InferModelNormalizedType<C["model"]>[] {
    const filtersManager = new InMemoryQueryFilter<DBFullSchema, C>(
      mapQueryForDBFields(collectionSchema, {
        filters: queryFilters,
      })
    );
    // @ts-ignore
    return (this.stores[collectionSchema.model.dbName] = this.stores[
      collectionSchema.model.dbName
    ].reduce((prev, current, currentIndex) => {
      if (!filtersManager.filter(current)) return prev;
      const updated = {
        ...this.stores[collectionSchema.model.dbName][currentIndex],
        ...collectionSchema.model.mapToDB(data),
      };
      this.stores[collectionSchema.model.dbName][currentIndex] = updated;
      prev.push(collectionSchema.model.mapFromDB(updated));
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
      data[relationKey] = relation.multiple
        ? data.map(
            relationCollectionSchema.model.mapFromDB.bind(
              relationCollectionSchema.model
            )
          )
        : relationCollectionSchema.model.mapFromDB(data[relationKey]);
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
