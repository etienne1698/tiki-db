import type { Database } from "../database";
import type { InferNormalizedSchema, Schema } from "../schema/schema";

export abstract class Relation<S extends Schema = Schema> {
  constructor(public related: S, public field: string) {}

  abstract getFor(
    data: any,
    database: Database<any>
  ): InferNormalizedSchema<S> | InferNormalizedSchema<S>[];
}
