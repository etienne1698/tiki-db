import type { DatabaseStore } from "../database/database_store";
import type { InferNormalizedSchema, Schema } from "../schema/schema";

export abstract class Relation<S extends Schema = Schema> {
  constructor(public related: S, public field: string) {}

  abstract getFor(
    data: any,
    store: DatabaseStore
  ): InferNormalizedSchema<S> | InferNormalizedSchema<S>[];
}
