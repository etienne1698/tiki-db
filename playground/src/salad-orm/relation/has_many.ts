import type { Model } from "../model/model";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  getFor(_model: M, _data: any): InferModelNormalizedType<MRelated>[] {
    return [];
  }
}

export function hasMany<M extends Model = Model>(
  model: M,
  field: InferModelFieldName<M>
) {
  return new HasManyRelation(model, field);
}
