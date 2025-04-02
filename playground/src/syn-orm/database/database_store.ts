import type { InferModelNormalizedType, Model, Primary } from "../model";
import type { Query } from "../query/query";
import type { AnyButMaybeT, MaybeAsArray } from "../types";

export interface DatabaseStore {
  get<M extends Model>(model: Model, query?: Query): InferModelNormalizedType<M>[];

  load<M extends Model>(model: M): void;

  delete<M extends Model>(
    model: M,
    primary: Primary,
    query?: Query
  ): Partial<InferModelNormalizedType<M>> | undefined;

  update<M extends Model>(
    model: M,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<M>>,
    query?: Query
  ): Partial<InferModelNormalizedType<M>> | undefined;

  insert<M extends Model>(
    model: M,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<M>>>
  ): Partial<InferModelNormalizedType<M>>[];

  save<M extends Model>(
    model: M,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<M>>>,
    saveRelations?: boolean
  ):
    | Partial<InferModelNormalizedType<M>>
    | Partial<InferModelNormalizedType<M>>[];

  saveOne<M extends Model>(
    model: M,
    data: AnyButMaybeT<InferModelNormalizedType<M>>,
    saveRelations?: boolean
  ): Partial<InferModelNormalizedType<M>> | undefined;

  saveRelations<M extends Model>(model: M, data: Record<string, any>): void;

  getByPrimary<M extends Model>(
    model: M,
    primary: Primary
  ): InferModelNormalizedType<M> | undefined;

  getByPrimaries<M extends Model>(
    model: M,
    primaries: Primary[]
  ): InferModelNormalizedType<M>[];
};
