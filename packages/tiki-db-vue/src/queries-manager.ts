import { CollectionSchema, Query } from "tiki-db";

type QueryCacheData = {
  refCount: number;
  result: any;
  schema: CollectionSchema;
  isFindFirst: boolean;
  query: Query<any, any>;
};

export class QueriesManager {
  queries: { [queryHash: string]: QueryCacheData } = {};

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

  isQueryConcerned<C extends CollectionSchema>(
    collectionSchema: C,
    queryCacheData: QueryCacheData,
    data: any
  ): boolean {
    return true;
  }

  getQueryConcerned<C extends CollectionSchema>(
    collectionSchema: C,
    data: any
  ) {
    const result: QueryCacheData[] = [];
    for (const queryCacheData of Object.values(
      this.queries
    ) as QueryCacheData[]) {
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
    if (this.queries[queryHash].refCount === 0) {
      delete this.queries[queryHash];
    }
  }
}
