import "fake-indexeddb/auto";
import { IndexedDBStorage } from "../../src/storage/idb/idb_storage";
import { collections } from "./base_schema";
import { type DatabaseFullSchema } from "../..";

export async function getTestStorage() {
  return new IndexedDBStorage<DatabaseFullSchema<typeof collections>>({ dbName: "myDB" });
}
