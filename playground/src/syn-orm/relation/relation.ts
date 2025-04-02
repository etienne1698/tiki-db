import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import type { Schema } from "../schema/schema";
import type { InferModelNormalizedType } from "../types";

export abstract class Relation<
  SRelated extends Schema = Schema,
  MRelated extends Model = Model<SRelated, any>
> {
  constructor(public related: MRelated, public field: unknown) {}

  abstract getFor<From extends Model>(
    model: From,
    data: any,
    store: Datastore,
  ): InferModelNormalizedType<MRelated> | InferModelNormalizedType<MRelated>[];
}
