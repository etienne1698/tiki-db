import {
  AnyButMaybeT,
  Collection,
  CollectionSchema,
  DatabaseFullSchema,
  QueriesManager,
  Query,
  QueryResult,
} from "tiki-db";
import { ref, Ref } from "vue";

export type IVueCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> = Omit<
  Collection<IsAsync, Schema, DBFullSchema>,
  "findMany" | "findFirst" | "schema" | "database" | "query"
> & {
  findMany<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ): Ref<QueryResult<Schema, DBFullSchema, Q>>;

  findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(
    query: Q
  ): Ref<QueryResult<Schema, DBFullSchema, Q>[0]>;
};

export class VueCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements IVueCollectionWrapper<false, Schema, DBFullSchema>
{
  constructor(
    private collection: Collection<false, Schema, DBFullSchema>,
    private queriesManager: QueriesManager<Ref>
  ) {}

  findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(query: Q) {
    const queryHash = this.queriesManager.hashQuery(
      this.collection.schema,
      query as Parameters<typeof this.collection.findFirst>[0],
      true
    );
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash) as Ref<
        QueryResult<Schema, DBFullSchema, Q>[0]
      >;
    }
    const queryResult = this.collection.findFirst(
      query as Parameters<typeof this.collection.findFirst>[0]
    );
    return this.queriesManager.set(
      queryHash,
      this.collection.schema,
      true,
      query,
      ref(queryResult)
    ) as Ref<QueryResult<Schema, DBFullSchema, Q>[0]>;
  }

  findMany<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ) {
    const queryHash = this.queriesManager.hashQuery(
      this.collection.schema,
      query as Parameters<typeof this.collection.findMany>[0],
      false
    );
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash) as Ref<
        QueryResult<Schema, DBFullSchema, Q>
      >;
    }
    const queryResult = this.collection.findMany(
      query as Parameters<typeof this.collection.findMany>[0]
    );
    return this.queriesManager.set(
      queryHash,
      this.collection.schema,
      false,
      query,
      ref(queryResult)
    ) as Ref<QueryResult<Schema, DBFullSchema, Q>>;
  }

  update(
    queryFilters: Parameters<typeof this.collection.update>[0],
    data: Parameters<typeof this.collection.update>[1]
  ) {
    const queryResult = this.collection.update(queryFilters, data);
    return queryResult;
  }

  remove(queryFilters: Parameters<typeof this.collection.remove>[0]) {
    const queryResult = this.collection.remove(queryFilters);
    this.reRunQueryConcernedByRemove(queryFilters);
    return queryResult;
  }

  insert(
    data: Parameters<typeof this.collection.insert>[0],
    opts?: Parameters<typeof this.collection.insert>[1]
  ) {
    const queryResult = this.collection.insert(data, opts);
    this.reRunQueryConcerned(data);
    return queryResult;
  }

  upsert(
    data: Parameters<typeof this.collection.upsert>[0],
    opts?: Parameters<typeof this.collection.upsert>[1]
  ) {
    const queryResult = this.collection.upsert(data, opts);
    this.reRunQueryConcerned(data);
    return queryResult;
  }

  insertMany(
    data: Parameters<typeof this.collection.insertMany>[0],
    opts?: Parameters<typeof this.collection.insertMany>[1]
  ) {
    const queryResult = this.collection.insertMany(data, opts);
    this.reRunQueryConcerned(data);
    return queryResult;
  }
  updateMany(
    queryFilters: Parameters<typeof this.collection.updateMany>[0],
    data: Parameters<typeof this.collection.updateMany>[1]
  ) {
    const queryResult = this.collection.updateMany(queryFilters, data);
    this.reRunQueryConcerned(data);
    return queryResult;
  }
  upsertMany(
    data: Parameters<typeof this.collection.upsertMany>[0],
    opts?: Parameters<typeof this.collection.upsertMany>[1]
  ) {
    const queryResult = this.collection.upsertMany(data, opts);
    this.reRunQueryConcerned(data);
    return queryResult;
  }

  reRunQueryConcernedByRemove(queryFilters: any) {
    const queryCacheDataConcerned =
      this.queriesManager.getQueriesConcernedByRemove(
        this.collection.schema,
        queryFilters
      );
    for (const queryCacheData of queryCacheDataConcerned) {
      queryCacheData.result.value = queryCacheData.isFindFirst
        ? this.collection.findFirst(
            queryCacheData.query as Parameters<
              typeof this.collection.findFirst
            >[0]
          )
        : this.collection.findMany(
            queryCacheData.query as Parameters<
              typeof this.collection.findMany
            >[0]
          );
    }
  }

  reRunQueryConcerned(data: any) {
    const queryCacheDataConcerned = this.queriesManager.getQueriesConcerned(
      this.collection.schema,
      data
    );
    for (const queryCacheData of queryCacheDataConcerned) {
      queryCacheData.result.value = queryCacheData.isFindFirst
        ? this.collection.findFirst(
            queryCacheData.query as Parameters<
              typeof this.collection.findFirst
            >[0]
          )
        : this.collection.findMany(
            queryCacheData.query as Parameters<
              typeof this.collection.findMany
            >[0]
          );
    }
  }
}
