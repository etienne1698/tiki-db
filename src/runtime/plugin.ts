import Model from "./lib/Model";
import {
  defineNuxtPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from "#app";

const PAYLOAD_TYPE = "Model";

export default defineNuxtPlugin((_nuxtApp) => {
  definePayloadReducer(
    PAYLOAD_TYPE,
    (data) => data instanceof Model && JSON.stringify(data.toJSON())
  );
  definePayloadReviver(PAYLOAD_TYPE, (data) => JSON.parse(data));
});
