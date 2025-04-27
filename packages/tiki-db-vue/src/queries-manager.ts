import { Query } from "tiki-db";

export class QueriesManager {
  queries: {
    [queryHash: string]: {
      refCount: number;
      result: any;
    };
  } = {};

  hashQuery(query: Query<any, any>, isFindFirst: boolean): string {
    // TODO: better hash, JSON.stringify is heavy
    return JSON.stringify(query) + isFindFirst.toString();
  }

  has(queryHash: ReturnType<typeof this.hashQuery>) {
    return Boolean(this.queries[queryHash]);
  }

  set(queryHash: ReturnType<typeof this.hashQuery>, result: any) {
    this.queries[queryHash] = { result, refCount: 1 };
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
