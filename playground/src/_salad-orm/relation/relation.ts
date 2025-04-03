import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import type { InferModelNormalizedType } from "../types";
import { belongsTo } from "./belongs_to";
import { hasMany } from "./has_many";

export abstract class Relation<
  M extends Model = Model,
  MRelated extends Model = Model
> {
  constructor(public related: MRelated, public field: unknown) {}

  abstract getFor(
    model: M,
    data: any,
    store: Datastore
  ): InferModelNormalizedType<MRelated> | InferModelNormalizedType<MRelated>[];
}

export class Relations<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public model: M, public schema: R) {}
}

export type RelationSetupFn<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  hasMany: typeof hasMany;
  belongsTo: typeof belongsTo<M>;
}) => R;

export function relations<
  M extends Model,
  R extends Record<string, Relation> = Record<string, Relation>
>(model: M, setup: RelationSetupFn<M, R>) {
  return new Relations<M, R>(model, setup({ hasMany, belongsTo }));
}
