import type { CollectionSchema } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
import type { Query, QueryResult } from "../query/query";
import type { Relations } from "../relation/relation";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";

export interface Storage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  IsAsync extends boolean = false
> {

  /**
   *
   * @param database
   * To create the migrations collection in the storage and/or create all collections
   */
  init(database: Database): Promise<boolean>;

  find<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collection: C,
    query?: Q
  ): IsAsync extends true
    ? Promise<QueryResult<C, DBFullSchema, Q>>
    : QueryResult<C, DBFullSchema, Q>;

  findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collection: C,
    query?: Q
  ): IsAsync extends true
    ? Promise<QueryResult<C, DBFullSchema, Q>[0]>
    : QueryResult<C, DBFullSchema, Q>[0];

  remove<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    query?: Query<C, DBFullSchema>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  update<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    query?: Query<C, DBFullSchema>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  insert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  insertRelations<C extends CollectionSchema>(
    collection: C,
    relation: keyof C["relations"],
    data: Record<string, any>
  ): IsAsync extends true ? Promise<void> : void;

  getByPrimary<C extends CollectionSchema>(
    collection: C,
    primary: Primary
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]> | undefined>
    : InferModelNormalizedType<C["model"]> | undefined;

  getByPrimaries<C extends CollectionSchema>(
    collection: C,
    primaries: Primary[]
  ): IsAsync extends true
    ? Promise<InferModelNormalizedType<C["model"]>[]>
    : InferModelNormalizedType<C["model"]>[];
}
