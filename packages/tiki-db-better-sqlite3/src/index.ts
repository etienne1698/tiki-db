import {
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  InferCollectionUpdate,
  InferCollectionInsert,
  InferModelNormalizedType,
  QueryFilters,
  Query,
  QueryResult,
  Storage,
  InMemoryQueryFilter,
  Relation,
  mapQueryForDBFields,
} from "tiki-db";


export class BetterSqlite3Storage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<DBFullSchema>
{
  clear<C extends CollectionSchema>(collectionSchema: C) {
    throw "not implemented yet";
  }

  clearAll() {
    throw "not implemented yet";
  }

  declare database: Database;

  async init(database: Database): Promise<void> {
    this.database = database;
  }

  insert<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionInsert<C, DBFullSchema>,
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]> {
    throw "not implemented yet";
  }

  insertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionInsert<C, DBFullSchema>[],
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]>[] {
    throw "not implemented yet";
  }

  upsert<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>,
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]> | undefined {
    throw "not implemented yet";
  }

  upsertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>[],
    saveRelations?: boolean
  ): InferModelNormalizedType<C["model"]>[] {
    throw "not implemented yet";
  }

  findMany<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collectionSchema: C,
    query?: Q | undefined
  ): QueryResult<C, DBFullSchema, Q> {
    throw "not implemented yet";
  }

  findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collectionSchema: C, query?: Q | undefined): QueryResult<C, DBFullSchema, Q>[0] {
    throw "not implemented yet";
  }

  remove<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>
  ): void {
    throw "not implemented yet";
  }

  update<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): InferModelNormalizedType<C["model"]> | undefined {
    throw "not implemented yet";
  }

  updateMany<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): InferModelNormalizedType<C["model"]>[] {
    throw "not implemented yet";
  }
}
