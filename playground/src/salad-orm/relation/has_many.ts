import type { Database } from "../database/database";
import type { Model } from "../model/model";
import type { QueryRunner } from "../query/query_runner";
import type {
  AnyCollection,
  InferModelFieldName,
  InferModelNormalizedType,
} from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  getFor(
    model: M,
    data: any,
    database: Database
  ): InferModelNormalizedType<MRelated>[] {
    /**
 * query(this.related)
      .where(this.field, "$eq", model.$primary())
      .get();
 */

    return (
      database.collections[model.dbName] as QueryRunner<AnyCollection>
    ).$query({
      filters: {
        $eq: { [this.field as string]: model.primary(data) },
      },
    }) as unknown as InferModelNormalizedType<MRelated>[];
  }
}

export function hasMany<M extends Model = Model>(
  model: M,
  field: InferModelFieldName<M>
) {
  return new HasManyRelation(model, field);
}
