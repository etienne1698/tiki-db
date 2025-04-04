import { Collection } from "../collection/collection";
import type { Datastore } from "./datastore";
import { QueryRunner } from "../query/query_runner";
import type { Constructor } from "../types";

export class Database<
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  declare store: Datastore;
  declare query: {
    [K in keyof Collections]: QueryRunner<typeof this, Collections[K]>;
  };

  constructor(public collections: Collections, store: Constructor<Datastore>) {
    this.store = new store(this) 
    this.query = {} as {
      [K in keyof Collections]: QueryRunner<typeof this, Collections[K]>;
    };

    for (const [key, collection] of Object.entries(collections)) {
      // @ts-ignore
      this.query[key] = new QueryRunner(this, collection);
    }
  }

  /*   query<M extends Model>(model: M) {
    return new QueryBuilder(this.store, model);
  } */
}

export function database<
  Collections extends Record<string, Collection> = Record<string, Collection>
>(collections: Collections, store: Constructor<Datastore>) {
  return new Database(collections, store);
}
