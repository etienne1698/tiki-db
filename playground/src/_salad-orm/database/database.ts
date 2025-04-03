import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import { Collection } from "../collection/collection";
import type { Datastore } from "./datastore";

export class Database<
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  declare query: {
    [K in keyof Models]: Collection<Models[K]>;
  };

  constructor(public collections, public store: Datastore) {
    this.collections = {} as {
      [K in keyof Models]: Collection<Models[K]>;
    };
    for (const [key, model] of Object.entries(models)) {
      // @ts-ignore
      this.collections[key] = new Collection(this, model);
    }
  }

/*   query<M extends Model>(model: M) {
    return new QueryBuilder(this.store, model);
  } */
}

export function createDatabase<
  Models extends Record<string, Model> = Record<string, Model>
>(models: Models, store: Datastore) {
  return new Database(models, store);
}
