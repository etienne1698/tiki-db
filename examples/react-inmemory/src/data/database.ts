import { database, InMemoryStorage } from "tiki-db";
import { reactDatabaseWrapper } from "tiki-db/react";

import { seed } from "./seed";
import { collections } from "./schema";

const storage = new InMemoryStorage();
export const db = reactDatabaseWrapper(database(collections, storage));

db.init();

seed(db);
