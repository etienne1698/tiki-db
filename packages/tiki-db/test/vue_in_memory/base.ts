import {
  database,
  InMemoryStorage,
} from "../../src";

import { vueDatabaseWrapper } from "../../src/reactive/vue/vue";
import { collections } from "../base_schema";

export function getTestDatabase() {

  const storage = new InMemoryStorage();
  const db = vueDatabaseWrapper(database(collections, storage));

  db.init();

  return {
    db,
  };
}
