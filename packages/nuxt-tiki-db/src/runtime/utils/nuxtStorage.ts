import { InMemoryStorage, type Storage } from "tiki-db";

export function nuxtStorage<
  IsAsync extends boolean,
  S extends Storage<any, IsAsync> = Storage<any, IsAsync>
>(storage: () => S): S {
  if (import.meta.server) return storage();
  return new InMemoryStorage() as unknown as S;
}
