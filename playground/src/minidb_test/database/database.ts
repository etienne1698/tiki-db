import type { Model, Primary } from "../model";
import { type Query } from "../query/query";
import { QueryBuilder } from "../query/query_builder";
import type { MaybeAsArray } from "../types";
import { Collection } from "./collection";

export type DatabaseStore = {
  get<M extends Model>(model: Model, query?: Query): M[];
  load<M extends Model>(model: M): void;
  delete<M extends Model>(
    model: M,

    primary: Primary,
    query?: Query
  ): Partial<M> | undefined;

  update<M extends Model>(
    model: M,
    primary: Primary,
    data: any,
    query?: Query
  ): Partial<M> | undefined;

  insert<M extends Model>(model: M, data: MaybeAsArray<any>): Partial<M>[];

  save<M extends Model>(
    model: M,
    data: MaybeAsArray<any>,
    saveRelations?: boolean
  ): Partial<M> | Partial<M>[];

  saveOne<M extends Model>(
    model: M,
    data: any,
    saveRelations?: boolean
  ): Partial<M> | undefined;

  saveRelations<M extends Model>(model: M, data: Record<string, any>): void;

  getByPrimary<M extends Model>(model: M, primary: Primary): M | undefined;
};

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
