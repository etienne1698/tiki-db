import type { Model } from "./model/model";
import type { Field } from "./schema/field";
import type { Schema } from "./schema/schema";

export type MaybeAsArray<T> = T | T[];

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type AnyButMaybeT<T> = DeepPartial<T> & Record<string, any>;

export type PrimaryKey = string | string[];
export type Primary = string;

export type InferModelNormalizedType<M extends Model> = InferNormalizedSchema<
  M["schema"]
>;
export type InferModelFieldName<M extends Model> = keyof M["schema"]["schema"];

export type InferNormalizedSchema<S extends Schema> = ReturnType<
  S["normalize"]
>;

export type InferNormalizedField<F extends Field> = ReturnType<F["normalize"]>;
