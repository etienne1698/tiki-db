import type { DatabaseStore } from "../database/database_store";
import type { Model } from "../model/model";
import type { Schema } from "../schema/schema";
import type { InferModelNormalizedType } from "../types";

export abstract class Relation<
  S extends Schema = Schema,
  M extends Model = Model<S, any>
> {
  constructor(public related: M, public field: string) {}

  abstract getFor(
    data: any,
    store: DatabaseStore
  ): InferModelNormalizedType<M> | InferModelNormalizedType<M>[];
}
