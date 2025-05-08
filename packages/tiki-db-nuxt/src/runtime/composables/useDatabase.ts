import {
  type DatabaseFullSchema,
  type Database,
  type Storage,
  QueriesManager,
  type InMemoryStorage,
} from "tiki-db";
import { VueCollectionWrapper, VueDatabaseWrapper } from "tiki-db-vue";
import { NuxtDatabases } from "../utils/NuxtDatabases";

/**
 *
 * @param database
 * @param dbName set this if you have multiple databases
 */
export async function useDatabase<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(
  database: () => Database<IsAsync, FullSchema, S>,
  dbName: string = "_dbName"
) {
  const allStorageState = useState<{ [key: string]: any }>(
    `${dbName}_all_storage_state`
  );
  const allDatabases = useState("_nuxt_databases", () =>
    shallowRef(new NuxtDatabases())
  );

  const cached = allDatabases.value.get(dbName);
  if (cached) {
    return cached as unknown as VueDatabaseWrapper<IsAsync, FullSchema, S>;
  }

  const db = new VueDatabaseWrapper<IsAsync, FullSchema, S>(
    database(),
    VueCollectionWrapper,
    new QueriesManager<Ref>()
  );

  allDatabases.value.set(dbName, db);

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
  }

  return db;
}
