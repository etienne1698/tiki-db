import {
  Collection,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  QueriesManager,
  Query,
  Storage,
} from "tiki-db";
import {
  IVueCollectionWrapper,
  VueCollectionWrapper,
} from "./collection-wrapper";
import { Ref } from "vue";

export class VueDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
> {
  collections = {} as {
    [K in keyof FullSchema["schema"]]: IVueCollectionWrapper<
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
      qm: QueriesManager<Ref>
    ) => IVueCollectionWrapper<false, CollectionSchema, FullSchema>,
    public queriesManager: QueriesManager<Ref>
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

export function vueDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(database: Database<IsAsync, FullSchema, S>) {
  return new VueDatabaseWrapper<IsAsync, FullSchema, S>(
    database,
    VueCollectionWrapper,
    new QueriesManager<Ref>()
  );
}
