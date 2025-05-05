import { NuxtDatabases } from "../utils/NuxtDatabases";

const PAYLOAD_NAME = "NuxtDatabases";

export default definePayloadPlugin(() => {
  definePayloadReducer(
    PAYLOAD_NAME,
    (data) => data instanceof NuxtDatabases && "_"
  );
  definePayloadReviver(PAYLOAD_NAME, () => new NuxtDatabases());
});
