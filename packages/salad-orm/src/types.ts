import type { Model } from "./model/model";
import type { Field } from "./model/field";
import type { Relation, Relations } from "./relation/relation";
import type { Collection } from "./collection/collection";

export type Constructor<T> = new (...args: any[]) => T;

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

export type AnyModel<
  F extends Record<string, Field<any>> = Record<string, Field<any>>
> = Model<F>;

export type AnyRelation<
  M extends AnyModel = AnyModel,
  MRelated extends AnyModel = AnyModel
> = Relation<M, MRelated>;

export type AnyRelations<
  M extends AnyModel = AnyModel,
  R extends Record<string, AnyRelation> = Record<string, AnyRelation>
> = Relations<M, R>;

export type AnyCollection<
  M extends AnyModel = AnyModel,
  R extends AnyRelations = AnyRelations
> = Collection<M, R>;
