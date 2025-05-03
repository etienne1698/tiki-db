import {
  CollectionSchema,
  QueriesManager,
  Query,
  QueryCacheData,
} from "tiki-db";
import { Ref } from "vue";

export class VueQueryManager extends QueriesManager<Ref> {
  queries: {
    [queryHash: string]: QueryCacheData<Ref>;
  } = {};

  getQueryCache(queryHash: string): QueryCacheData<Ref> {
    return this.queries[queryHash];
  }
  getAllQueryCache(): QueryCacheData<Ref>[] {
    return Object.values(this.queries);
  }
  setQueryCache(
    queryHash: string,
    queryCacheData: Partial<{
      refCount: number;
      result: Ref<any, any>;
      schema: CollectionSchema;
      isFindFirst: boolean;
      query: Query<any, any>;
    }>
  ): QueryCacheData<Ref> {
    this.queries[queryHash] = {
      ...this.queries[queryHash],
      ...queryCacheData,
    };
    return this.queries[queryHash];
  }
}
