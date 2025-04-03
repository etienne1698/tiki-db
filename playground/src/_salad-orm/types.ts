import type { Model } from "./document/document";
import type { Field } from "./document/field";
import type { Schema } from "./document/schema";

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


export type RelationsOf<M extends Model> = keyof ReturnType<M["relations"]>;