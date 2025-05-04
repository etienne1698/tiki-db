import { QueriesManager, type QueryCacheData } from "tiki-db";
import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from "#app";

const PAYLOAD_TYPE = "QueriesManager";

export default definePayloadPlugin((_nuxtApp) => {
  definePayloadReducer(PAYLOAD_TYPE, (data) => {
    const dataIsQueriesManager = data instanceof QueriesManager;
    if (!dataIsQueriesManager) return false;
    const toStringify: {
      [key: string]: { [key in keyof QueryCacheData<Ref>]: any };
    } = {};
    for (const [queryHash, qc] of Object.entries(data.queries) as [
      string,
      QueryCacheData<Ref>
    ][]) {
      toStringify[queryHash] = qc;
      toStringify[queryHash].result = toStringify[queryHash].result.value;
    }
    return JSON.stringify(toStringify);
  });
  definePayloadReviver(PAYLOAD_TYPE, (data) => {
    const qm = new QueriesManager<Ref>();

    for (const [queryHash, qc] of Object.entries(JSON.parse(data)) as [
      string,
      QueryCacheData<Ref>
    ][]) {
      qm.queries[queryHash] = qc;
      qm.queries[queryHash].result = ref(qc.result);
    }
    return qm;
  });
});
