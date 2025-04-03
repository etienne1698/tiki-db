import type { Model } from "../model/model";
import type { Query } from "../query/query";
import type { Relation } from "../relation/relation";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";

export interface Datastore {
  get<M extends Model>(
    model: M,
    query?: Query<M>
  ): InferModelNormalizedType<M>[];

  load<M extends Model>(model: M): void;

  delete<M extends Model>(
    model: M,
    primary: Primary,
    query?: Query<M>
  ): Partial<InferModelNormalizedType<M>> | undefined;

  update<M extends Model>(
    model: M,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<M>>,
    query?: Query<M>
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

  saveRelations<R extends Record<string, Relation>>(relations: R, data: Record<string, any>): void;

  getByPrimary<M extends Model>(
    model: M,
    primary: Primary
  ): InferModelNormalizedType<M> | undefined;

  getByPrimaries<M extends Model>(
    model: M,
    primaries: Primary[]
  ): InferModelNormalizedType<M>[];
}
