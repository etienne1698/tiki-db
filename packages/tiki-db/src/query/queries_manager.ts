import { CollectionSchema } from "../collection/collection_schema";
import { Query } from "./query";

export type QueryCacheData<T = unknown> = {
  refCount: number;
  result: T;
  schema: CollectionSchema;
  isFindFirst: boolean;
  query: Query<any, any>;
};

export abstract class QueriesManager<T> {
  abstract getQueryCache(queryHash: string): QueryCacheData<T>;
  abstract getAllQueryCache(): QueryCacheData<T>[];
  abstract setQueryCache(
    queryHash: string,
    queryCacheData: Partial<QueryCacheData<T>>
  ): QueryCacheData<T>;

  hashQuery<C extends CollectionSchema>(
    collectionSchema: C,
    query: Query<C, any>,
    isFindFirst: boolean
  ): string {
    // TODO: better hash, JSON.stringify is heavy
    return (
      JSON.stringify(collectionSchema) +
      JSON.stringify(query) +
      isFindFirst.toString()
    );
  }

  has(queryHash: ReturnType<typeof this.hashQuery>) {
    return Boolean(this.getQueryCache(queryHash));
  }

  isQueryConcerned<C extends CollectionSchema>(
    collectionSchema: C,
    queryCacheData: QueryCacheData<T>,
    data: any
  ): boolean {
    return true;
  }

  getQueriesConcernedByRemove<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: any
  ) {
    const result: QueryCacheData<T>[] = [];
    for (const queryCacheData of this.getAllQueryCache()) {
      result.push(queryCacheData);
    }
    return result;
  }

  getQueriesConcerned<C extends CollectionSchema>(
    collectionSchema: C,
    data: any
  ) {
    const result: QueryCacheData<T>[] = [];
    for (const queryCacheData of this.getAllQueryCache()) {
      if (this.isQueryConcerned(collectionSchema, queryCacheData, data)) {
        result.push(queryCacheData);
      }
    }
    return result;
  }

  set<C extends CollectionSchema>(
    queryHash: ReturnType<typeof this.hashQuery>,
    collectionSchema: C,
    isFindFirst: boolean,
    query: Query<any, any>,
    result: any
  ) {
    this.setQueryCache(queryHash, {
      result,
      refCount: 1,
      schema: collectionSchema,
      isFindFirst,
      query,
    });
    return this.getQueryCache(queryHash).result;
  }

  subscribe(queryHash: ReturnType<typeof this.hashQuery>) {
    const queryCacheData = this.getQueryCache(queryHash);
    this.setQueryCache(queryHash, { refCount: queryCacheData.refCount + 1 });
    return queryCacheData.result;
  }

  unsubscribe(queryHash: ReturnType<typeof this.hashQuery>) {
    const queryCacheData = this.getQueryCache(queryHash);
    this.setQueryCache(queryHash, { refCount: queryCacheData.refCount - 1 });
  }
}
