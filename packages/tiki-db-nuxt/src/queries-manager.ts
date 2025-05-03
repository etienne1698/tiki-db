import { useState } from "nuxt/app";
import { QueriesManager, QueryCacheData } from "tiki-db";
import { shallowRef, ShallowRef } from "vue";

export class NuxtQueriesManager extends QueriesManager<ShallowRef> {
  queries: ShallowRef<{
    [queryHash: string]: QueryCacheData<ShallowRef>;
  }> = useState("_queries_cache", () => shallowRef({}));

  getQueryCache(queryHash: string): QueryCacheData<ShallowRef> {
    return this.queries.value[queryHash];
  }
  getAllQueryCache(): QueryCacheData<ShallowRef>[] {
    return Object.values(this.queries);
  }
  setQueryCache(
    queryHash: string,
    queryCacheData: Partial<QueryCacheData<ShallowRef>>
  ): QueryCacheData<ShallowRef> {
    this.queries.value[queryHash] = {
      ...this.queries.value[queryHash],
      ...queryCacheData,
    };
    return this.queries.value[queryHash];
  }
}
