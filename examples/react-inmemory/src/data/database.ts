import { database } from "tiki-db";
import { reactDatabaseWrapper } from "tiki-db/reactive/react";
import { InMemoryStorage } from "tiki-db/storage/memory";

import { seed } from "./seed";
import { collections } from "./schema";

const storage = new InMemoryStorage();
export const db = reactDatabaseWrapper(database(collections, storage));

db.init();

seed(db);
