import { asyncDatabase } from "tiki-db";
import { getTestStorage } from "./base_storage";
import { collections } from "./base_schema";

export async function getTestDatabase() {
  const storage = await getTestStorage();

  const db = asyncDatabase(collections, storage);
  await db.init();

  await storage.clearAll();

  return {
    db,
  };
}
