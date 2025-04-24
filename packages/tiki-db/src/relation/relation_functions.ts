import type { Model } from "../model/model";
import { InferModelFieldName } from "../types";
import { BelongsToRelation } from "./belongs_to";
import { HasManyRelation } from "./has_many";
import { HasManyThrough } from "./has_many_through";
import { Relations, type Relation } from "./relation";

export function hasMany<MRelated extends Model = Model>(
  model: MRelated,
  field: InferModelFieldName<MRelated>
) {
  return new HasManyRelation(model, field);
}

export function belongsTo<M extends Model, MRelated extends Model = Model>(
  model: MRelated,
  field: InferModelFieldName<M>
) {
  return new BelongsToRelation(model, field);
}

export function hasManyThrough<
  M extends Model,
  MRelated extends Model = Model,
  MThrough extends Model = Model
>(
  model: MRelated,
  field: InferModelFieldName<MRelated>,
  throughModel: MThrough,
  throughField: InferModelFieldName<MThrough>
) {
  return new HasManyThrough(model, field, throughModel, throughField);
}

export type RelationSetupFn<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  hasMany: typeof hasMany;
  belongsTo: <MRelated extends Model>(
    model: MRelated,
    field: InferModelFieldName<M>
  ) => ReturnType<typeof belongsTo<M, MRelated>>;
  hasManyThrough: <MRelated extends Model, MThrough extends Model>(
    model: MRelated,
    field: InferModelFieldName<MRelated>,
    throughModel: MThrough,
    throughField: InferModelFieldName<MThrough>
  ) => ReturnType<typeof hasManyThrough<M, MRelated, MThrough>>;
}) => R;

export function relations<
  M extends Model,
  R extends Record<string, Relation> = Record<string, Relation>
>(model: M, setup: RelationSetupFn<M, R>) {
  return new Relations(model, setup({ hasMany, belongsTo, hasManyThrough }));
}
