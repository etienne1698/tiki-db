import type { Storage } from "tiki-db";
import { InMemoryStorage } from "tiki-db/storage/memory";

export function nuxtStorageWrapper<
  IsAsync extends boolean,
  S extends Storage<any, IsAsync> = Storage<any, IsAsync>
>(storage: () => S): S {
  if (import.meta.client) return storage();
  return new InMemoryStorage() as unknown as S;
}
