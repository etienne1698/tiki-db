import type { Model } from "../model/model";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class BelongsToRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  getFor(
    _model: M,
    _data: any
  ): InferModelNormalizedType<MRelated> | undefined {
    return undefined;
  }
}

export function belongsTo<From extends Model, M extends Model = Model>(
  model: M,
  field: InferModelFieldName<From>
) {
  return new BelongsToRelation(model, field);
}
