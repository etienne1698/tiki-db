import { CollectionSchema } from "../collection/collection_schema";
import type { Storage } from "../storage/storage";
import { DeepPartial } from "../types";
import { QueryBuilder } from "../query/query_builder";
import { Query } from "../query/query";
import { Collection } from "../collection/collection";
import { Migrations, Migrator } from "./migration";

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
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
> {
  collections: {
    [K in keyof FullSchema["schema"]]: Collection<
      IsAsync,
      FullSchema["schema"][K],
      FullSchema
    >;
  } = {} as {
    [K in keyof FullSchema["schema"]]: Collection<
      IsAsync,
      FullSchema["schema"][K],
      FullSchema
    >;
  };

  declare migrator?: Migrator;

  constructor(
    public schema: FullSchema,
    public storage: S,
    public migrations?: Partial<M>
  ) {
    if (this.migrations) {
      this.migrator = new Migrator(this as Database);
    }
    for (const [key, collection] of Object.entries(schema.schema)) {
      // @ts-ignore
      this.collections[key] = new Collection(this, collection);
    }
  }

  init() {
    return this.storage.init(this);
  }

  async migrate() {
    if (!this.migrator) return;
    await this.migrator.migrate();
  }

  query<C extends CollectionSchema>(
    collection: C,
    query?: DeepPartial<Query<C, FullSchema>>
  ) {
    return new QueryBuilder<IsAsync, C, FullSchema, S>(this, collection, query);
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
  >,
  M extends Migrations<DatabaseFullSchema<Collections>> = Migrations<
    DatabaseFullSchema<Collections>
  >
>(collections: Collections, storage: Storage, migrations?: Partial<M>) {
  return new Database<false, DatabaseFullSchema<Collections>, S>(
    extractFullSchema(collections),
    storage as S,
    migrations
  );
}

export function asyncDatabase<
  Collections extends Record<string, CollectionSchema> = Record<
    string,
    CollectionSchema
  >,
  S extends Storage<DatabaseFullSchema<Collections>, true> = Storage<
    DatabaseFullSchema<Collections>,
    true
  >,
  M extends Migrations<DatabaseFullSchema<Collections>> = Migrations<
    DatabaseFullSchema<Collections>
  >
>(collections: Collections, storage: S, migrations?: Partial<M>) {
  return new Database<true, DatabaseFullSchema<Collections>, S>(
    extractFullSchema(collections),
    storage,
    migrations
  );
}
