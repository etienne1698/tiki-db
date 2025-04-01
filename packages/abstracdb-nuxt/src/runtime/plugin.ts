import { Model } from "abstracdb";
import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from "#app";

const PAYLOAD_TYPE = "Model";

export default definePayloadPlugin((_nuxtApp) => {
  definePayloadReducer(
    PAYLOAD_TYPE,
    (data) => data instanceof Model && JSON.stringify(data)
  );
  definePayloadReviver(PAYLOAD_TYPE, (data) => JSON.parse(data));
});
