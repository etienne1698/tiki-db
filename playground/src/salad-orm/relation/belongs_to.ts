import type { Storage } from "../database/storage";
import type { Model } from "../model/model";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class BelongsToRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  override getFor(
    _model: M,
    _data: any,
    _store: Storage
  ): InferModelNormalizedType<MRelated> {
    throw new Error(
      "Method not implemented. This is a placeholder for the belongsTo relation."
    );
  }
}

export function belongsTo<From extends Model, M extends Model = Model>(
  model: M,
  field: InferModelFieldName<From>
) {
  return new BelongsToRelation(model, field);
}
