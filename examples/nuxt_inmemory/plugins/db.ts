import { Database, database, InMemoryStorage } from "tiki-db";
import { collections } from "~/data/database";
import { seed } from "~/data/seed";
import { nuxtDatabaseWrapper } from "tiki-db-nuxt";

export default defineNuxtPlugin(() => {
  const storage = new InMemoryStorage();
  const db = nuxtDatabaseWrapper(database(collections, storage));

  db.init();

  if (import.meta.server) {
    seed(db as unknown as Database);
  }
  return { provide: { db } };
});
