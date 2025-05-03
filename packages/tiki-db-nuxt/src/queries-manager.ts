import { useState } from "nuxt/app";
import { QueriesManager, QueryCacheData } from "tiki-db";
import { Ref, shallowRef, ShallowRef } from "vue";

export class NuxtQueriesManager extends QueriesManager<Ref> {
  queries: ShallowRef<{
    [queryHash: string]: QueryCacheData<Ref>;
  }> = useState("_queries_cache", () => shallowRef({}));

  getQueryCache(queryHash: string): QueryCacheData<Ref> {
    return this.queries.value[queryHash];
  }
  getAllQueryCache(): QueryCacheData<Ref>[] {
    return Object.values(this.queries);
  }
  setQueryCache(
    queryHash: string,
    queryCacheData: Partial<QueryCacheData<Ref>>
  ): QueryCacheData<Ref> {
    this.queries.value[queryHash] = {
      ...this.queries.value[queryHash],
      ...queryCacheData,
    };
    return this.queries.value[queryHash];
  }
}
