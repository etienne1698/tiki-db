import type { Model } from "./model/model";
import type { Field } from "./model/field";

export type MaybeAsArray<T> = T | T[];

export type DeepPartial<T> = Partial<{
  [P in keyof T]?: DeepPartial<T[P]>;
}>;

export type AnyButMaybeT<T> = DeepPartial<T> & Record<string, any>;

export type PrimaryKey = string | string[];
export type Primary = string;

export type InferModelNormalizedType<M extends Model> = ReturnType<
  M["normalize"]
>;

export type InferModelFieldName<M extends Model> = keyof M["schema"];

export type InferNormalizedField<F extends Field> = ReturnType<F["normalize"]>;