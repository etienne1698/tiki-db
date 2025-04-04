import { Database } from "../database/database";
import { createDefaultStorage } from "./default_storage";

export function inMemoryStorage<D extends Database>() {
  const stores: any = {};

  return createDefaultStorage<D>(
    "inMemory",
    (collection) => {
      stores[collection.model.dbName] = stores[collection.model.dbName] || {};
      return true;
    },
    (collection) => {
      return stores[collection.model.dbName];
    }
  );
}
