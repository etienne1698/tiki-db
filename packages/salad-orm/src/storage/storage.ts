import type { Collection } from "../collection/collection";
import type { Query } from "../query/query";
import type { Relations } from "../relation/relation";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import type { Database } from "../database/database";

export type Storage<D extends Database = Database> = (database: D) => {
  name: string;

  /**
   * 
   * @param collection The collection to load
   * 
   * This method is used to load the collection into the storage.
   * It is called when the database is created or when a new collection is added.
   */
  load<C extends Collection>(collection: C): boolean;

  get<C extends Collection>(
    collection: C,
    query?: Query<C, D>
  ): InferModelNormalizedType<C["model"]>[];

  remove<C extends Collection>(
    collection: C,
    primary: Primary,
    query?: Query<C, D>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined;

  update<C extends Collection>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    query?: Query<C, D>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined;

  insert<C extends Collection>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): Partial<InferModelNormalizedType<C["model"]>>[];

  save<C extends Collection>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations?: boolean
  ):
    | Partial<InferModelNormalizedType<C["model"]>>
    | Partial<InferModelNormalizedType<C["model"]>>[];

  saveOne<C extends Collection>(
    collection: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations?: boolean
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined;

  saveRelations<R extends Relations>(
    relations: R,
    data: Record<string, any>
  ): void;

  getByPrimary<C extends Collection>(
    collection: C,
    primary: Primary
  ): InferModelNormalizedType<C["model"]> | undefined;

  getByPrimaries<C extends Collection>(
    collection: C,
    primaries: Primary[]
  ): InferModelNormalizedType<C["model"]>[];
}
