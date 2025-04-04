import { Collection } from "../collection/collection";
import type { Storage } from "../storage/storage";
import { QueryRunner } from "../query/query_runner";
import type { Constructor } from "../types";

export class Database<
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  declare storage: Storage;

  collections: {
    [K in keyof Collections]: QueryRunner<Collections[K], Collections>;
  } = {} as {
    [K in keyof Collections]: QueryRunner<Collections[K], Collections>;
  };

  dbMapCollection: {
    [K in keyof Collections]: Collections[K];
  } = {} as {
    [K in keyof Collections]: Collections[K];
  };

  constructor(collections: Collections, storage: Constructor<Storage>) {
    this.storage = new storage(this);

    for (const [key, collection] of Object.entries(collections)) {
      // @ts-ignore
      this.collections[key] = new QueryRunner(this, collection);
      // @ts-ignore
      this.dbMapCollection[collection.model.dbName] = collection;
      this.storage.load(collection);
    }
  }

  /*   query<M extends Model>(model: M) {
    return new QueryBuilder(this.store, model);
  } */
}

export function database<
  Collections extends Record<string, Collection> = Record<string, Collection>
>(collections: Collections, storage: Constructor<Storage>) {
  return new Database(collections, storage);
}
