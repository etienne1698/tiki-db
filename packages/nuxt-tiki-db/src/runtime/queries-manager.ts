import { useState } from "nuxt/app";
import { QueriesManager, type QueryCacheData } from "tiki-db";
import { shallowRef, type Ref, type ShallowRef } from "vue";

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

  // TODO: this is not completed
  toJSON() {
    return JSON.stringify(
      (Object.entries(this.queries) as [string, QueryCacheData<Ref>][]).map(
        (qc) => {}
      )
    );
  }

  // TODO: this is not completed
  static fromJSON(json: string) {
    const fromJson = new NuxtQueriesManager();
    for (const qc of JSON.parse(json)) {
      fromJson.queries.value[qc.result as string] = {};
    }
    return fromJson;
  }
}
