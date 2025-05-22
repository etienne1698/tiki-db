import { Collection } from "../collection/collection";
import { CollectionSchema } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
import { QueriesManager } from "../query/queries_manager";
import { Storage } from "../storage/storage";
import { AsyncReactiveCollectionWrapper } from "./async_collection_wrapper";
import { ReactiveCollectionWrapper } from "./collection_wrapper";

export class ReactiveDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  ReactivePrimitive = unknown
> {
  collections = {} as {
    [K in keyof FullSchema["schema"]]: ReactiveCollectionWrapper<
      FullSchema["schema"][K],
      FullSchema
    >;
  };

  init() {
    return this.database.init();
  }

  constructor(
    public database: Database<IsAsync, FullSchema, S>,
    collectionConstructor: new (
      schema: Collection<IsAsync, CollectionSchema, FullSchema>,
      qm: QueriesManager<ReactivePrimitive>
    ) =>
      | ReactiveCollectionWrapper<CollectionSchema, FullSchema>
      | AsyncReactiveCollectionWrapper<CollectionSchema, FullSchema>,
    public queriesManager: QueriesManager<ReactivePrimitive>
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
