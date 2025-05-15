import type { CollectionSchema } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
import type { Query, QueryFilters, QueryResult } from "../query/query";
import type {
  InferCollectionInsert,
  InferCollectionUpdate,
  InferModelNormalizedType,
} from "../types";

export interface Storage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  IsAsync extends boolean = false
> {
  init(database: Database): Promise<void>;

  clear<C extends CollectionSchema>(
    collection: C
  ): IsAsync extends true ? Promise<void> : void;

  clearAll(): IsAsync extends true ? Promise<void> : void;

  findMany<
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
    queryFilters: QueryFilters<C>
  ): IsAsync extends true ? Promise<void> : void;

  update<C extends CollectionSchema>(
    collection: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  updateMany<C extends CollectionSchema>(
    collection: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>>[]>
    : Partial<InferModelNormalizedType<C["model"]>>[];

  insert<C extends CollectionSchema>(
    collection: C,
    data: InferCollectionInsert<C, DBFullSchema>,
    saveRelations?: boolean
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  insertMany<C extends CollectionSchema>(
    collection: C,
    data: InferCollectionInsert<C, DBFullSchema>[],
    saveRelations?: boolean
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>>[]>
    : Partial<InferModelNormalizedType<C["model"]>>[];

  upsert<C extends CollectionSchema>(
    collection: C,
    data: InferCollectionUpdate<C, DBFullSchema>,
    saveRelations?: boolean
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>> | undefined>
    : Partial<InferModelNormalizedType<C["model"]>> | undefined;

  upsertMany<C extends CollectionSchema>(
    collection: C,
    data: InferCollectionUpdate<C, DBFullSchema>[],
    saveRelations?: boolean
  ): IsAsync extends true
    ? Promise<Partial<InferModelNormalizedType<C["model"]>>[]>
    : Partial<InferModelNormalizedType<C["model"]>>[];
}
