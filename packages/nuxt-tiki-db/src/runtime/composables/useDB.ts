import {
  type CollectionSchema,
  type DatabaseFullSchema,
  type Migrations,
  type Database,
  type Storage,
  QueriesManager,
} from "tiki-db";
import { nuxtDatabaseWrapper } from "../database-wrapper";

export function useDB<
  IsAsync extends boolean = boolean,
  Collections extends Record<string, CollectionSchema> = Record<
    string,
    CollectionSchema
  >,
  DBFullSchema extends DatabaseFullSchema<Collections> = DatabaseFullSchema<Collections>,
  S extends Storage<DBFullSchema, IsAsync> = Storage<DBFullSchema, IsAsync>,
  M extends Migrations<DatabaseFullSchema<Collections>> = Migrations<
    DatabaseFullSchema<Collections>
  >,
  D extends Database<IsAsync, DBFullSchema, S, M> = Database<
    IsAsync,
    DBFullSchema,
    S,
    M
  >
>(database: D) {
  const queriesManager = useState("_tiki-db-queries-manager", () =>
    shallowRef(new QueriesManager<Ref>())
  );
  return nuxtDatabaseWrapper(database, queriesManager.value);
}
