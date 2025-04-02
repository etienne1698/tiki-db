import type { DatabaseStore } from "../database/database_store";
import type { Model } from "../model";
import type { Schema } from "../schema";
import type { InferNormalizedSchema } from "../schema/schema";
import { Relation } from "./relation";

export class HasManyRelation<S extends Schema = Schema> extends Relation<S> {
  override getFor(
    _data: any,
    _database: DatabaseStore
  ): InferNormalizedSchema<S>[] {
    return [];
  }
}

export function hasMany<M extends Model = Model>(model: M, field: string) {
  return new HasManyRelation(model.schema, field);
}
