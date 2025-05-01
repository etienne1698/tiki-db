import { PrimaryKey } from "drizzle-orm/gel-core";
import { CollectionSchema } from "../../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../../database/database";
import { Query, QueryResult } from "../../query/query";
import { Relation } from "../../relation/relation";
import {
  Primary,
  AnyButMaybeT,
  MaybeAsArray,
  InferModelFieldName,
} from "../../types";
import { Storage } from "../storage";
import { InMemoryQueryFilter } from "./in_memory_query_filter";

export class InMemoryStorage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<DBFullSchema>
{
  stores: { [key in keyof DBFullSchema["schema"]]: any } = {} as {
    [key in keyof DBFullSchema["schemaDbName"]]: Array<
      ReturnType<DBFullSchema["schemaDbName"][key]["model"]["normalize"]>
    >;
  };

  filtersManager = new InMemoryQueryFilter<DBFullSchema>();

  declare database: Database;

  async init(database: Database): Promise<void> {
    this.database = database;
    for (const collection of Object.values(database.schema.schema)) {
      // @ts-ignore
      this.stores[collection.model.dbName] = [];
    }
  }

  insert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>,
    saveRelations?: boolean
  ): MaybeAsArray<ReturnType<C["model"]["normalize"]>> {
    if (Array.isArray(data)) {
      const allInserted: ReturnType<C["model"]["normalize"]>[] = [];
      for (const d of data) {
        const inserted = collection.model.normalize(d) as ReturnType<
          C["model"]["normalize"]
        >;
        if (saveRelations) {
          this.#saveRelations(collection, d);
        }
        this.stores[collection.model.dbName].push(inserted);
        allInserted.push(inserted);
      }
      return allInserted;
    } else {
      const inserted = collection.model.normalize(data);
      if (saveRelations) {
        this.#saveRelations(collection, data);
      }
      this.stores[collection.model.dbName].push(inserted);
      return inserted as ReturnType<C["model"]["normalize"]>;
    }
  }

  #getQueryByPrimary<C extends CollectionSchema>(
    collection: C,
    primary: Primary
  ) {
    return {
      filters: {
        [collection.model.primaryKey as InferModelFieldName<C["model"]>]: {
          $eq: primary,
        },
      },
    } as Query<C, DBFullSchema>;
  }

  // TODO: this function is not completed
  upsert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>,
    saveRelations?: boolean
  ): MaybeAsArray<ReturnType<C["model"]["normalize"]>> | undefined {
    if (Array.isArray(data)) {
      const result: ReturnType<C["model"]["normalize"]>[] = [];
      return result;
    } else {
      const primary = collection.model.primary(data);
      if (primary) {
        return this.update(
          collection,
          data,
          this.#getQueryByPrimary(collection, primary)
        );
      }
    }
  }

  find<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collection: C, query?: Q | undefined): QueryResult<C, DBFullSchema, Q> {
    const res = this.filtersManager.apply(
      this.stores[collection.model.dbName],
      query
    ) as QueryResult<C, DBFullSchema, Q>;
    if (query?.with) {
      return res.map((data) =>
        this.#getDataWithRelations(collection, query, data)
      );
    }
    return res;
  }

  findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collection: C, query?: Q | undefined) {
    return this.find(collection, query)?.[0];
  }

  remove<C extends CollectionSchema>(
    collection: C,
    query: Query<C, DBFullSchema> | undefined
  ): Partial<ReturnType<C["model"]["normalize"]>> | undefined {
    throw new Error("Method not implemented.");
  }

  update<C extends CollectionSchema>(
    collection: C,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    query?: Query<C, DBFullSchema> | undefined
  ): ReturnType<C["model"]["normalize"]> | undefined {
    throw new Error("Method not implemented.");
  }

  #getRelationQuery<C extends CollectionSchema>(
    collection: C,
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
  >(collection: C, query: Q | undefined, data: any) {
    if (!query?.with) return;
    for (const [relationKey, relationQueryOrBoolean] of Object.entries(
      query.with
    )) {
      if (!relationQueryOrBoolean) return data;
      const relation = collection.relations.schema[relationKey];

      const relationCollection =
        this.database.schema.schemaDbName[relation.related.dbName];

      const relationQuery = this.#getRelationQuery(collection, relation, data);
      if (typeof relationQueryOrBoolean !== "boolean") {
        relationQuery.filters = {
          ...(relationQueryOrBoolean?.filters || {}),
          ...relationQuery.filters,
        };
      }
      data[relationKey] = this[relation.multiple ? "find" : "findFirst"](
        relationCollection,
        relationQuery as Query<typeof relationCollection, DBFullSchema>
      );
    }
    return data;
  }

  // TODO: upsert (not insert)
  #saveRelations<C extends CollectionSchema>(collection: C, data: any) {
    for (const relationKey in collection.relations.schema) {
      if (!data?.[relationKey]) continue;

      const relation = collection.relations.schema[relationKey];
      const relationCollection =
        this.database.schema.schemaDbName[relation.related.dbName];

      if (Array.isArray(data[relationKey])) {
        if (relation.multiple) {
          this.insert(relationCollection, data[relationKey]);
        }
      } else {
        this.insert(relationCollection, data[relationKey]);
      }
    }
  }
}
