import type { Model } from "./document/document";
import type { Field } from "./document/field";

export type Constructor<T> = new (...args: any[]) => T;

export type MaybeAsArray<T> = T | T[];

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type AnyButMaybeT<T> = DeepPartial<T> & Record<string, any>;

export type PrimaryKey = string | string[];
export type Primary = string;

export type InferModelNormalizedType<M extends Model> = ReturnType<
  M["schema"]["normalize"]
>;

export type InferModelFieldName<M extends Model> = keyof M["schema"]["schema"];

export type InferNormalizedField<F extends Field> = ReturnType<F["normalize"]>;
