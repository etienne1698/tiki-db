import { database } from "tiki-db";
import { getTestStorage } from "./base_storage";
import { collections } from "./base_schema";

export function getTestDatabase() {
  const storage = getTestStorage();

  const db = database(collections, storage);
  db.init();

  storage.clearAll();

  return {
    db,
  };
}
