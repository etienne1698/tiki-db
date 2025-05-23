import { database } from "tiki-db";
import { vueDatabaseWrapper } from "tiki-db/reactive/vue";
import { InMemoryStorage } from "tiki-db/storage/memory";

import { seed } from "./seed";
import { collections } from "./schema";

const storage = new InMemoryStorage();
export const db = vueDatabaseWrapper(database(collections, storage));

db.init();

seed(db);
