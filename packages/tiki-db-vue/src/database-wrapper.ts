import {
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  Migrations,
  Query,
  Storage,
} from "tiki-db";
import { VueCollectionWrapper } from "./collection-wrapper";
import { QueriesManager } from "./queries-manager";

export class VueDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
> {
  queriesManager = new QueriesManager();

  collections = {} as {
    [K in keyof FullSchema["schema"]]: VueCollectionWrapper<
      FullSchema["schema"][K],
      FullSchema
    >;
  };

  init() {
    return this.database.init();
  }

  query<C extends CollectionSchema>(
    collection: C,
    query?: Query<C, FullSchema>
  ) {
    return this.database.query(collection, query);
  }

  get storage() {
    return this.database.storage;
  }

  constructor(public database: Database<IsAsync, FullSchema, S, M>) {
    for (const [key, collection] of Object.entries(database.collections)) {
      // @ts-ignore
      this.collections[key] = new VueCollectionWrapper(
        collection,
        this.queriesManager
      );
    }
  }
}

export function vueDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
>(database: Database<IsAsync, FullSchema, S, M>) {
  return new VueDatabaseWrapper(database);
}
