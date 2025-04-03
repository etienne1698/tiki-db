import type { Collection } from "../collections/collections";
import type { Query } from "../query/query";
import type { Relation } from "../relations/relations";
import type {
  AnyButMaybeT,
  InferCollectionNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";

export interface Datastore {
  get<M extends Collection>(
    model: M,
    query?: Query<M>
  ): InferCollectionNormalizedType<M>[];

  load<M extends Collection>(model: M): void;

  delete<M extends Collection>(
    model: M,
    primary: Primary,
    query?: Query<M>
  ): Partial<InferCollectionNormalizedType<M>> | undefined;

  update<M extends Collection>(
    model: M,
    primary: Primary,
    data: AnyButMaybeT<InferCollectionNormalizedType<M>>,
    query?: Query<M>
  ): Partial<InferCollectionNormalizedType<M>> | undefined;

  insert<M extends Collection>(
    model: M,
    data: MaybeAsArray<AnyButMaybeT<InferCollectionNormalizedType<M>>>
  ): Partial<InferCollectionNormalizedType<M>>[];

  save<M extends Collection>(
    model: M,
    data: MaybeAsArray<AnyButMaybeT<InferCollectionNormalizedType<M>>>,
    saveRelations?: boolean
  ):
    | Partial<InferCollectionNormalizedType<M>>
    | Partial<InferCollectionNormalizedType<M>>[];

  saveOne<M extends Collection>(
    model: M,
    data: AnyButMaybeT<InferCollectionNormalizedType<M>>,
    saveRelations?: boolean
  ): Partial<InferCollectionNormalizedType<M>> | undefined;

  saveRelations<R extends Record<string, Relation>>(
    relations: R,
    data: Record<string, any>
  ): void;

  getByPrimary<M extends Collection>(
    model: M,
    primary: Primary
  ): InferCollectionNormalizedType<M> | undefined;

  getByPrimaries<M extends Collection>(
    model: M,
    primaries: Primary[]
  ): InferCollectionNormalizedType<M>[];
}
