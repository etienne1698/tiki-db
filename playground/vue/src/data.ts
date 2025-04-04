import { collections } from "../../common/src/data";
import { database, VueStorage } from "../../common/re-export";

export const db = database(collections, VueStorage);
