import { asyncDatabase, type DatabaseFullSchema } from "tiki-db";
import { IndexedDBStorage } from "tiki-db-idb";

import { vueAsyncDatabaseWrapper } from "tiki-db-vue";

import { seed } from "./seed";
import { collections } from "./schema";

const storage = new IndexedDBStorage<DatabaseFullSchema<typeof collections>>();
export const db = vueAsyncDatabaseWrapper(asyncDatabase(collections, storage));

export async function init() {
  await db.init();
  const user = await db.collections.users.findFirst({});
  if (user.value == undefined) {
    seed(db);
  }
}


init();