import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import type { Schema } from "../schema/schema";
import type { InferModelFieldName, InferNormalizedSchema } from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  MRelated extends Model
> extends Relation<MRelated> {
  override getFor<From extends Model>(
    model: From,
    data: any,
    store: Datastore
  ): InferNormalizedSchema<MRelated['schema']>[] {
    return new QueryBuilder(store, this.related)
      .whereEq(
        this.field as keyof MRelated["schema"]["schema"],
        model.primary(data)
      )
      .get();
  }
}

export function hasMany<M extends Model = Model>(
  model: M,
  field: InferModelFieldName<M>
) {
  return new HasManyRelation(model, field);
}
