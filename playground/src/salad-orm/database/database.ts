import { Collection } from "../collection/collection";
import type { Storage } from "../storage/storage";
import { QueryRunner } from "../query/query_runner";
import type { Constructor } from "../types";

export class Database<
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  declare storage: Storage;
  declare collections: {
    [K in keyof Collections]: QueryRunner<Collections, Collections[K]>;
  };

  constructor(collections: Collections, storage: Constructor<Storage>) {
    this.storage = new storage(this);
    this.collections = {} as {
      [K in keyof Collections]: QueryRunner<Collections, Collections[K]>;
    };

    for (const [key, collection] of Object.entries(collections)) {
      // @ts-ignore
      this.collections[key] = new QueryRunner(this, collection);
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
