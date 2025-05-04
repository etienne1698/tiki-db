import { QueriesManager } from "tiki-db";
import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from "#app";

const PAYLOAD_TYPE = "Model";

export default definePayloadPlugin((_nuxtApp) => {
  definePayloadReducer(
    PAYLOAD_TYPE,
    (data) => data instanceof QueriesManager && JSON.stringify({})
  );
  definePayloadReviver(PAYLOAD_TYPE, (data) => ({}));
});
