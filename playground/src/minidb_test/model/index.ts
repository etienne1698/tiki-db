import type { Relation } from "../relation";
import type { Field } from "../schema";
import { Schema } from "../schema/schema";

export class Model<
  S extends Schema = Schema,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public schema: S, public relations: () => R) {
    this.schema = schema;
    this.relations = relations;
  }
}

export function model<
  S extends Record<string, Field>,
  R extends Record<string, Relation> = Record<string, Relation>
>(schema: S, relations: () => R = () => ({} as R)) {
  return new Model(new Schema(schema), relations);
}
