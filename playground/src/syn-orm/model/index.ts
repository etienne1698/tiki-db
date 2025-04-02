import type { Relation } from "../relation";
import type { Field } from "../schema";
import { Schema, type InferNormalizedSchema } from "../schema/schema";

export type PrimaryKey = string | string[];
export type Primary = string;

export type RelationsOf<M extends Model> = keyof ReturnType<M["relations"]>;

export class Model<
  S extends Schema = Schema,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public schema: S, public relations: () => R) {}
}

export function model<
  S extends Record<string, Field>,
  R extends Record<string, Relation> = Record<string, Relation>
>(schema: S, relations: () => R = () => ({} as R)) {
  return new Model(new Schema(schema), relations);
}

export type InferModelNormalizedType<M extends Model> = InferNormalizedSchema<
  M["schema"]
>;
