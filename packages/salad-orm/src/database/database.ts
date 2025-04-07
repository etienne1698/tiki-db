import { Collection } from "../collection/collection";
import type { Storage } from "../storage/storage";
import { QueryRunner } from "../query/query_runner";
import { Constructor } from "../types";

export class Database<
  Collections extends Record<string, Collection> = Record<string, Collection>,
  S extends Storage = Storage
> {
  declare storage: S;

  collections: {
    [K in keyof Collections]: QueryRunner<Collections[K], typeof this>;
  } = {} as {
    [K in keyof Collections]: QueryRunner<Collections[K], typeof this>;
  };

  mapCollectionDbNameCollection: {
    [K in keyof Collections as Collections[K]["model"]["dbName"]]: Collections[K];
  } = {} as {
    [K in keyof Collections as Collections[K]["model"]["dbName"]]: Collections[K];
  };

  constructor(collections: Collections, storage: Constructor<Storage>) {
    this.storage = new storage(this) as S;

    for (const [key, collection] of Object.entries(collections)) {
      // @ts-ignore
      this.collections[key] = new QueryRunner(this, collection);
      // @ts-ignore
      this.mapCollectionDbNameCollection[collection.model.dbName] = collection;
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
