import type { CollectionSchema } from "../collection/collection_schema";
import { Database } from "../database/database";
import type { Query, QueryResult } from "../query/query";
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
  load<C extends CollectionSchema>(collection: C): boolean;

  get<C extends CollectionSchema, D extends Database = Database, Q extends Query<C, D> = Query<C, D>>(
    collection: C,
    query?: Q
  ): IsAsync extends true
    ? Promise<QueryResult<C, D, Q>>
    : QueryResult<C, D, Q>;

  remove<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primary: Primary,
    query?: Query<C, D>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  update<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    query?: Query<C, D>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  insert<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>[]> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>>[] | undefined;

  save<C extends CollectionSchema, D extends Database = Database>(
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

  saveOne<C extends CollectionSchema, D extends Database = Database>(
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

  getByPrimary<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primary: Primary
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]> | undefined>
    : InferModelNormalizedType<C["model"]> | undefined;

  getByPrimaries<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primaries: Primary[]
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]>[]>
    : InferModelNormalizedType<C["model"]>[];
}
