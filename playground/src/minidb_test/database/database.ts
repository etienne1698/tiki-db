import type { Model } from "../model";
import { QueryBuilder, type Query } from "../query";

export abstract class Database<
  Models extends Record<string, Model> = Record<string, Model>
> {
  constructor(public models: Models) {}

  query<M extends Model>(model: M) {
    return new QueryBuilder(this, model);
  }

  abstract get<M extends Model>(model: Model, query?: Query): M[];
}

// TODO:
export abstract class AsyncDatabase<
  Models extends Record<string, Model>
> extends Database<Models> {}

export abstract class SyncDatabase<
  Models extends Record<string, Model>
> extends Database<Models> {}
