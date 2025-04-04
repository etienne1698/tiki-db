import { collections, seed } from "../../common/src/data";
import { database, VueStorage } from "../../common/src/re-export";

export const db = database(collections, VueStorage);

seed(db);
