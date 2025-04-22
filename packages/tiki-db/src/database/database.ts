import { CollectionSchema } from "../collection/collection_schema";
import type { Storage } from "../storage/storage";
import { DeepPartial } from "../types";
import { QueryBuilder } from "../query/query_builder";
import { Query } from "../query/query";
import { Collection } from "../collection/collection";

export type DatabaseFullSchema<
  Schema extends Record<string, CollectionSchema> = Record<
    string,
    CollectionSchema
  >
> = {
  schema: Schema;
  schemaDbName: {
    [K in keyof Schema as Schema[K]["model"]["dbName"]]: Schema[K];
  };
};

function extractFullSchema<
  Schema extends Record<string, CollectionSchema> = Record<
    string,
    CollectionSchema
  >
>(schema: Schema): DatabaseFullSchema<Schema> {
  return {
    schema,
    schemaDbName: Object.keys(schema).reduce(
      (prev, k) => {
        return {
          ...prev,
          [k]: schema[k],
        };
      },
      {} as {
        [K in keyof Schema as Schema[K]["model"]["dbName"]]: Schema[K];
      }
    ),
  };
}

export class Database<
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema> = Storage<FullSchema>
> {
  collections: {
    [K in keyof FullSchema["schema"]]: Collection<
      FullSchema["schema"][K],
      FullSchema
    >;
  } = {} as {
    [K in keyof FullSchema["schema"]]: Collection<
      FullSchema["schema"][K],
      FullSchema
    >;
  };

  constructor(public schema: FullSchema, public storage: S) {
    for (const [key, collection] of Object.entries(schema.schema)) {
      // @ts-ignore
      this.collections[key] = new Collection(this, collection);
      this.storage.load(collection);
    }
  }

  query<C extends CollectionSchema>(
    collection: C,
    query?: DeepPartial<Query<C, FullSchema>>
  ) {
    return new QueryBuilder(this, collection, query);
  }
}

export function database<
  Collections extends Record<string, CollectionSchema> = Record<
    string,
    CollectionSchema
  >,
  S extends Storage<DatabaseFullSchema<Collections>, false> = Storage<
    DatabaseFullSchema<Collections>,
    false
  >
>(collections: Collections, storage: S) {
  return new Database(extractFullSchema(collections), storage);
}
