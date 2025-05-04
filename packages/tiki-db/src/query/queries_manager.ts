import { CollectionSchema } from "../collection/collection_schema";
import { Query } from "./query";

export type QueryCacheData<T = unknown> = {
  refCount: number;
  result: T;
  schema: CollectionSchema;
  isFindFirst: boolean;
  query: Query<any, any>;
};

export class QueriesManager<T> {
  queries: {
    [queryHash: string]: QueryCacheData<T>;
  } = {};

  getAllQueryCache() {
    return Object.values(this.queries);
  }

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
    return Boolean(this.queries[queryHash]);
  }

  // TODO: check if is concerned
  isQueryConcerned<C extends CollectionSchema>(
    collectionSchema: C,
    queryCacheData: QueryCacheData<T>,
    data: unknown
  ): boolean {
    return true;
  }

  // TODO: check if is concerned
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
    data: unknown | unknown[]
  ) {
    const result: Set<QueryCacheData<T>> = new Set([]);
    for (const queryCacheData of this.getAllQueryCache()) {
      if (Array.isArray(data)) {
        for (const d of data) {
          if (this.isQueryConcerned(collectionSchema, queryCacheData, d)) {
            result.add(queryCacheData);
          }
        }
      } else {
        if (this.isQueryConcerned(collectionSchema, queryCacheData, data)) {
          result.add(queryCacheData);
        }
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
    this.queries[queryHash] = {
      result,
      refCount: 1,
      schema: collectionSchema,
      isFindFirst,
      query,
    };
    return this.queries[queryHash].result;
  }

  subscribe(queryHash: ReturnType<typeof this.hashQuery>) {
    this.queries[queryHash].refCount += 1;
    return this.queries[queryHash].result;
  }

  unsubscribe(queryHash: ReturnType<typeof this.hashQuery>) {
    this.queries[queryHash].refCount -= 1;
  }
}
