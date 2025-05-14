import {
  Collection,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  QueriesManager,
  Query,
  Storage,
} from "tiki-db";
import { IReactCollectionWrapper, ReactCollectionWrapper } from "./collection-wrapper";
import { Signal } from "@preact/signals-react";

export class ReactDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
> {
  collections = {} as {
    [K in keyof FullSchema["schema"]]: IReactCollectionWrapper<
      false,
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

  constructor(
    public database: Database<IsAsync, FullSchema, S>,
    collectionConstructor: new (
      schema: Collection<false, CollectionSchema, FullSchema>,
      qm: QueriesManager<Signal>
    ) => IReactCollectionWrapper<false, CollectionSchema, FullSchema>,
    public queriesManager: QueriesManager<Signal>
  ) {
    for (const [key, collection] of Object.entries(database.collections)) {
      // @ts-ignore
      this.collections[key] = new collectionConstructor(
        collection,
        this.queriesManager
      );
    }
  }
}

export function reactDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(database: Database<IsAsync, FullSchema, S>) {
  return new ReactDatabaseWrapper<IsAsync, FullSchema, S>(
    database,
    ReactCollectionWrapper,
    new QueriesManager<Signal>()
  );
}
