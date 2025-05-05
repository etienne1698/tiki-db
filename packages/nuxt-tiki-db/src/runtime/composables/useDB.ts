import {
  type DatabaseFullSchema,
  type Database,
  type Storage,
  QueriesManager,
  type InMemoryStorage,
} from "tiki-db";
import { VueCollectionWrapper, VueDatabaseWrapper } from "tiki-db-vue";

declare global {
  interface Window {
    tikiDatabases: { [key: string]: VueDatabaseWrapper };
  }
}
if (import.meta.client) {
  window.tikiDatabases = {};
}

/**
 *
 * @param database
 * @param dbName set this if you have multiple databases
 */
export async function useDB<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(database: Database<IsAsync, FullSchema, S>, dbName: string = "_dbName") {
  const allStorageState = useState<{ [key: string]: any }>(
    `${dbName}_all_storage_state`
  );
  // TODO: do the same on server (⚠ no gloabal state, otherwise data will leak between session)
  if (import.meta.client && window.tikiDatabases[dbName]) {
    return window.tikiDatabases[dbName] as VueDatabaseWrapper<
      IsAsync,
      FullSchema,
      S
    >;
  }

  const db = new VueDatabaseWrapper<IsAsync, FullSchema, S>(
    database,
    VueCollectionWrapper,
    new QueriesManager<Ref>()
  );

  await db.init();

  if (import.meta.server) {
    allStorageState.value = (db.storage as unknown as InMemoryStorage).stores;
  }
  if (import.meta.client) {
    for (const [collectionDBName, collectionData] of Object.entries(
      allStorageState.value
    )) {
      const collectionSchema =
        db.database.schema.schemaDbName[collectionDBName];

      await db.database.storage.upsertMany(
        collectionSchema,
        collectionData,
        false
      );
    }

    // @ts-ignore
    window.tikiDatabases[dbName] = db;
  }

  return db;
}
