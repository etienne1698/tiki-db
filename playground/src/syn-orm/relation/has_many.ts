import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import type { Schema } from "../schema/schema";
import type { InferModelFieldName, InferNormalizedSchema } from "../types";
import { Relation } from "./relation";

export class HasManyRelation<S extends Schema = Schema> extends Relation<S> {
  override getFor(
    _data: any,
    _database: Datastore
  ): InferNormalizedSchema<S>[] {
    return [];
  }
}

export function hasMany<M extends Model = Model>(
  model: M,
  field: InferModelFieldName<M>
) {
  return new HasManyRelation(model, field);
}
