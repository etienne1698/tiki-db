import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import { Collection } from "./collection";
import type { DatabaseStore } from "./database_store";

export class Database<
  Models extends Record<string, Model> = Record<string, Model>
> {
  declare collections: {
    [K in keyof Models]: Collection<Models[K]>;
  };

  constructor(models: Models, public store: DatabaseStore) {
    this.collections = {} as {
      [K in keyof Models]: Collection<Models[K]>;
    };
    for (const [key, model] of Object.entries(models)) {
      this.store.load(model);
      // @ts-ignore
      this.collections[key] = new Collection(model);
    }
  }

  query<M extends Model>(model: M) {
    return new QueryBuilder(this, model);
  }
}

export function createDatabase<
  Models extends Record<string, Model> = Record<string, Model>
>(models: Models, store: DatabaseStore) {
  return new Database(models, store);
}
