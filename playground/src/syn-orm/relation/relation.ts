import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import type { InferModelNormalizedType } from "../types";

export abstract class Relation<MRelated extends Model = Model> {
  constructor(public related: MRelated, public field: unknown) {}

  abstract getFor<From extends Model>(
    model: From,
    data: any,
    store: Datastore
  ): InferModelNormalizedType<MRelated> | InferModelNormalizedType<MRelated>[];
}

export type Relations<R extends Record<string, Relation> = Record<string, Relation>> = R;

export function relations<M extends Model, R extends Relations>(model: M, relations: R) {}