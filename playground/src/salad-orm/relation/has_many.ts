import type { Datastore } from "../database/datastore";
import type { Model } from "../document/document";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  override getFor(
    _model: M,
    _data: any,
    _store: Datastore
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
