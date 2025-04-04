import collections from "../../common/data";
import { database, VueStorage } from "../../common/re-export";

export const db = database(collections, VueStorage);
