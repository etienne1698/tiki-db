import { asyncDatabase, type DatabaseFullSchema } from "../../src";
import { collections } from "../base_schema";
import { IndexedDBStorage } from "../../src/storage/idb/idb_storage";

export async function getTestDatabase() {
  const storage = new IndexedDBStorage<DatabaseFullSchema<typeof collections>>({ dbName: "myDB" });

  const db = asyncDatabase(collections, storage);
  await db.init();

  await storage.clearAll();

  return {
    db,
  };
}
  