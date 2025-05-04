import { NuxtQueriesManager } from "../queries-manager";
import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from "#app";

const PAYLOAD_TYPE = "Model";

export default definePayloadPlugin((_nuxtApp) => {
  definePayloadReducer(
    PAYLOAD_TYPE,
    (data) => data instanceof NuxtQueriesManager && data.toJSON()
  );
  definePayloadReviver(PAYLOAD_TYPE, (data) =>
    NuxtQueriesManager.fromJSON(data)
  );
});
