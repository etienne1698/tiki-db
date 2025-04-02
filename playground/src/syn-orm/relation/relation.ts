import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import type { Schema } from "../schema/schema";
import type { InferModelNormalizedType } from "../types";

export abstract class Relation<
  S extends Schema = Schema,
  M extends Model = Model<S, any>
> {
  constructor(public related: M, public field: unknown) {}

  abstract getFor(
    data: any,
    store: Datastore
  ): InferModelNormalizedType<M> | InferModelNormalizedType<M>[];
}
