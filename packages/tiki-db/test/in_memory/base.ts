import { database } from "../../src/index";
import { collections } from "../base_schema";
import { getTestStorage } from "./base_storage";

export function getTestDatabase() {
  const storage = getTestStorage();
  const db = database(collections, storage);
  db.init();

  return {
    db,
  };
}
