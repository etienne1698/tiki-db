import Model from "./lib/Model";
import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from "#app";

const PAYLOAD_TYPE = "Model";

export default definePayloadPlugin((_nuxtApp) => {
  definePayloadReducer(
    PAYLOAD_TYPE,
    (data) => data instanceof Model && JSON.stringify(data.toJSON())
  );
  definePayloadReviver(PAYLOAD_TYPE, (data) => JSON.parse(data));
});
