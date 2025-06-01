import { asyncDatabase, type DatabaseFullSchema } from "tiki-db";
import { vueAsyncDatabaseWrapper } from "tiki-db/reactive/vue";
import { IndexedDBStorage } from "tiki-db/storage/idb";

import { seed } from "./seed";
import { collections } from "./schema";

const storage = new IndexedDBStorage<DatabaseFullSchema<typeof collections>>();
export const db = vueAsyncDatabaseWrapper(asyncDatabase(collections, storage));

db.init();

seed(db);
