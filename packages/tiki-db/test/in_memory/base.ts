import { database } from "../../src/index";
import { collections } from "../base_schema";
import { InMemoryStorage } from "../../src/storage/in_memory/in_memory_storage";

export function getTestDatabase() {
  const storage = new InMemoryStorage();

  const db = database(collections, storage);

  db.init();

  return {
    db,
  };
}
