import type { Collection } from "../collection/collection";
import { Database } from "../database/database";
import type { Query } from "../query/query";
import type { Relations } from "../relation/relation";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";

export interface Storage<IsAsync extends boolean = false> {
  database: Database;
  /**
   *
   * @param collection The collection to load
   *
   * This method is used to load the collection into the storage.
   * It is called when the database is created or when a new collection is added.
   */
  load<C extends Collection>(collection: C): boolean;

  get<C extends Collection, D extends Database = Database>(
    collection: C,
    query?: Query<C, D>
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]>[]>
    : InferModelNormalizedType<C["model"]>[];

  remove<C extends Collection, D extends Database = Database>(
    collection: C,
    primary: Primary,
    query?: Query<C, D>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  update<C extends Collection, D extends Database = Database>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    query?: Query<C, D>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  insert<C extends Collection, D extends Database = Database>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>[]> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>>[] | undefined;

  save<C extends Collection, D extends Database = Database>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations?: boolean
  ): IsAsync extends true
    ? Promise<
        | Partial<InferModelNormalizedType<C["model"]>>
        | Partial<InferModelNormalizedType<C["model"]>>[]
      >
    :
        | Partial<InferModelNormalizedType<C["model"]>>
        | Partial<InferModelNormalizedType<C["model"]>>[];

  saveOne<C extends Collection, D extends Database = Database>(
    collection: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations?: boolean
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  saveRelations<R extends Relations, D extends Database = Database>(
    relations: R,
    data: Record<string, any>
  ): IsAsync extends true ? Promise<void> : void;

  getByPrimary<C extends Collection, D extends Database = Database>(
    collection: C,
    primary: Primary
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]> | undefined>
    : InferModelNormalizedType<C["model"]> | undefined;

  getByPrimaries<C extends Collection, D extends Database = Database>(
    collection: C,
    primaries: Primary[]
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]>[]>
    : InferModelNormalizedType<C["model"]>[];
}
