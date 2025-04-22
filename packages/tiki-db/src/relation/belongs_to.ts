import type { Model } from "../model/model";
import type { InferModelFieldName } from "../types";
import { Relation } from "./relation";

export class BelongsToRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  multiple: false = false;
}

export function belongsTo<M extends Model, MRelated extends Model = Model>(
  model: MRelated,
  field: InferModelFieldName<M>
) {
  return new BelongsToRelation(model, field);
}
