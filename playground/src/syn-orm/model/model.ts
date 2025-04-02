import type { Relation } from "../relation/relation";
import type { Field } from "../schema/field";
import { Schema } from "../schema/schema";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  Primary,
  PrimaryKey,
} from "../types";

export type RelationsOf<M extends Model> = keyof ReturnType<M["relations"]>;

export class Model<
  S extends Schema = Schema,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(
    public name: string,
    public primaryKey: PrimaryKey,
    public schema: S,
    public relations: () => R
  ) {}

  primary(data: AnyButMaybeT<InferModelNormalizedType<typeof this>>): Primary {
    if (typeof this.primaryKey === "string") {
      return data[this.primaryKey];
    }
    return this.primaryKey.map((k) => data[k]).join();
  }
}

export function model<
  S extends Record<string, Field>,
  R extends Record<string, Relation> = Record<string, Relation>
>(
  name: string,
  schema: S,
  opts?: Partial<{
    primaryKey: PrimaryKey;
    relations: () => R;
  }>
) {
  return new Model(
    name,
    opts?.primaryKey || "id",
    new Schema(schema),
    opts?.relations || (() => ({} as R))
  );
}
