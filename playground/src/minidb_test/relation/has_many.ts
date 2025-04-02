import type { Database } from "../database";
import type { InferMappedModel, ModelSchema } from "../model";
import { Relation } from "./relation";

export class HasManyRelation<T, M extends ModelSchema<T>> extends Relation<
  T,
  M
> {
  override getFor(_data: any, _database: Database<any>): InferMappedModel<M>[] {
    return [];
  }
}

export function hasMany<T, M extends ModelSchema<T>>(model: M, field: string) {
  return new HasManyRelation(model, field);
}
