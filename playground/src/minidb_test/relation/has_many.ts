import type { Database } from "../database";
import type { Model } from "../model";
import type { Schema } from "../schema";
import type { InferNormalizedSchema } from "../schema/schema";
import { Relation } from "./relation";

export class HasManyRelation<S extends Schema = Schema> extends Relation<S> {
  override getFor(
    _data: any,
    _database: Database<any>
  ): InferNormalizedSchema<S>[] {
    return [];
  }
}

export function hasMany<M extends Model = Model>(model: M, field: string) {
  return new HasManyRelation(model.schema, field);
}
