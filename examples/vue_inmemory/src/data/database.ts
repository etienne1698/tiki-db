import { database, InMemoryStorage } from "tiki-db";
import { vueDatabaseWrapper } from "tiki-db/vue";

import { seed } from "./seed";
import { collections } from "./schema";

const storage = new InMemoryStorage();
export const db = vueDatabaseWrapper(database(collections, storage));

db.init();

seed(db);
