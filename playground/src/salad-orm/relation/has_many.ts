import type { Storage } from "../database/storage";
import type { Model } from "../model/model";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  override getFor(
    _model: M,
    _data: any,
    _store: Storage
  ): InferModelNormalizedType<MRelated>[] {
    return [];
  }
}

export function hasMany<M extends Model = Model>(
  model: M,
  field: InferModelFieldName<M>
) {
  return new HasManyRelation(model, field);
}
