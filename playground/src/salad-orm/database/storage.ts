import type { Collection } from "../collection/collection";
import type { Query } from "../query/query";
import type { Relations } from "../relation/relation";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import type { Database } from "./database";

export abstract class Storage<D extends Database = Database> {
  constructor(public database: D) {}

  abstract get<C extends Collection>(
    collection: C,
    query?: Query<C>
  ): InferModelNormalizedType<C["model"]>[];

  abstract load<C extends Collection>(collection: C): void;

  abstract delete<C extends Collection>(
    collection: C,
    primary: Primary,
    query?: Query<C>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined;

  abstract update<C extends Collection>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    query?: Query<C>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined;

  abstract insert<C extends Collection>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): Partial<InferModelNormalizedType<C["model"]>>[];

  abstract save<C extends Collection>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations?: boolean
  ):
    | Partial<InferModelNormalizedType<C["model"]>>
    | Partial<InferModelNormalizedType<C["model"]>>[];

  abstract saveOne<C extends Collection>(
    collection: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations?: boolean
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined;

  abstract saveRelations<R extends Relations>(
    relations: R,
    data: Record<string, any>
  ): void;

  abstract getByPrimary<C extends Collection>(
    collection: C,
    primary: Primary
  ): InferModelNormalizedType<C["model"]> | undefined;

  abstract getByPrimaries<C extends Collection>(
    collection: C,
    primaries: Primary[]
  ): InferModelNormalizedType<C["model"]>[];
}
