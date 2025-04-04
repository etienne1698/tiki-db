import type { Model } from "../model/model";
import type { InferModelNormalizedType } from "../types";

export abstract class Relation<
  M extends Model = Model,
  MRelated extends Model = Model
> {
  constructor(public related: MRelated, public field: unknown) {}

  abstract getFor(
    model: M,
    data: any
  ):
    | InferModelNormalizedType<MRelated>
    | undefined
    | InferModelNormalizedType<MRelated>[];
}

export class Relations<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public model: M, public schema: R) {}
}
