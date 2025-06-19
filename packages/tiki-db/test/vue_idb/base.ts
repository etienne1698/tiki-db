import { asyncDatabase, type DatabaseFullSchema } from "../../src";
import { vueAsyncDatabaseWrapper } from "../../src/reactive/vue/vue";
import { IndexedDBStorage } from "../../src/storage/idb/idb_storage";
import { collections } from "../base_schema";
import "fake-indexeddb/auto";

export async function getTestDatabase() {
  const storage = new IndexedDBStorage<
    DatabaseFullSchema<typeof collections>
  >();
  const db = vueAsyncDatabaseWrapper(asyncDatabase(collections, storage));


  await db.init();

  
  await db.database.storage.clearAll();

  return {
    db,
  };
}
