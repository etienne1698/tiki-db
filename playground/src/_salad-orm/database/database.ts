import { Collection } from "../collection/collection";
import type { Datastore } from "./datastore";
import { QueryRunner } from "../query/query_runner";

export class Database<
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  declare query: {
    [K in keyof Collections]: QueryRunner<typeof this, Collections[K]>;
  };

  constructor(public collections: Collections, public store: Datastore) {
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

export function createDatabase<
  Collections extends Record<string, Collection> = Record<string, Collection>
>(collections: Collections, store: Datastore) {
  return new Database(collections, store);
}
