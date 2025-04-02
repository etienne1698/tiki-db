import type { Model } from "../model";
import { QueryBuilder, type Query } from "../query";

export type DatabaseStore = {
  get<M extends Model>(model: Model, query?: Query): M[];
};

export class Database<
  Models extends Record<string, Model> = Record<string, Model>
> {
  constructor(public models: Models, public store: DatabaseStore) {}

  query<M extends Model>(model: M) {
    return new QueryBuilder(this, model);
  }
}

export function createDatabase<
  Models extends Record<string, Model> = Record<string, Model>
>(models: Models, store: DatabaseStore) {
  return new Database(models, store);
}
