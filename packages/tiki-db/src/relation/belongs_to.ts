import type { Database } from "../database/database";
import type { Model } from "../model/model";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class BelongsToRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  getFor(
    _data: any,
     _database: Database
  ): InferModelNormalizedType<MRelated> | undefined {
    return undefined;
  }
}

export function belongsTo<M extends Model, MRelated extends Model = Model>(
  model: MRelated,
  field: InferModelFieldName<M>
) {
  return new BelongsToRelation(model, field);
}
