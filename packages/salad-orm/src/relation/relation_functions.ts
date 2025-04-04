import type { Model } from "../model/model";
import { belongsTo } from "./belongs_to";
import { hasMany } from "./has_many";
import { Relations, type Relation } from "./relation";

export type RelationSetupFn<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  hasMany: typeof hasMany;
  // TODO: here we lose the type for Mrelated ....
  belongsTo: typeof belongsTo<M>;
}) => R;

export function relations<
  M extends Model,
  R extends Record<string, Relation> = Record<string, Relation>
>(model: M, setup: RelationSetupFn<M, R>) {
  return new Relations(model, setup({ hasMany, belongsTo }));
}
