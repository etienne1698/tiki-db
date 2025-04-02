import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import type { Schema } from "../schema/schema";
import type { InferModelFieldName, InferNormalizedSchema } from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  SRelated extends Schema = Schema
> extends Relation<SRelated> {
  override getFor<From extends Model>(
    model: From,
    data: any,
    store: Datastore
  ): InferNormalizedSchema<SRelated>[] {
    return new QueryBuilder(store, this.related)
      .whereEq(this.field as keyof SRelated["schema"], model.primary(data))
      .get();
  }
}

export function hasMany<M extends Model = Model>(
  model: M,
  field: InferModelFieldName<M>
) {
  return new HasManyRelation(model, field);
}
