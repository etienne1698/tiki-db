import {
  type DatabaseFullSchema,
  type Migrations,
  type Database,
  type Storage,
  QueriesManager,
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
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
>(database: Database<IsAsync, FullSchema, S, M>, dbName: string = "_dbName") {
  // TODO: do the same on server (⚠ no gloabal state, otherwise data will leak between session)
  if (import.meta.client && window.tikiDatabases[dbName]) {
    console.error("qsdqs");
    return window.tikiDatabases[dbName] as VueDatabaseWrapper<
      IsAsync,
      FullSchema,
      S,
      M
    >;
  }

  const queriesManager = useState(dbName, () =>
    shallowRef(new QueriesManager<Ref>())
  );

  const db = new VueDatabaseWrapper<IsAsync, FullSchema, S, M>(
    database,
    VueCollectionWrapper,
    queriesManager.value
  );

  await db.init();

  if (import.meta.client) {
    for (const qc of Object.values(db.queriesManager.queries)) {
      const collectionDbName = qc.schema.model.dbName;
      qc.schema = db.database.schema.schemaDbName[collectionDbName];
      if (qc.isFindFirst) {
        await db.database.storage.upsert(qc.schema, qc.result.value, true);
      } else {
        await db.database.storage.upsertMany(qc.schema, qc.result.value, true);
      }
    }

    // @ts-ignore
    window.tikiDatabases[dbName] = db;
  }

  return db;
}
