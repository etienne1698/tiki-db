import "fake-indexeddb/auto";
import { IndexedDBStorage } from "../../src";
import { collections } from "./base_schema";
import { DatabaseFullSchema } from "tiki-db";

export async function getTestStorage() {
  return new IndexedDBStorage<DatabaseFullSchema<typeof collections>>({ dbName: "myDB" });
}
