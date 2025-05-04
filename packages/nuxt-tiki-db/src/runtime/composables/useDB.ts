import {
  type DatabaseFullSchema,
  type Migrations,
  type Database,
  type Storage,
  QueriesManager,
} from "tiki-db";
import { VueCollectionWrapper, VueDatabaseWrapper } from "tiki-db-vue";

export function useDB<
  IsAsync extends boolean = false,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<DBFullSchema, IsAsync> = Storage<DBFullSchema, IsAsync>,
  M extends Migrations<DBFullSchema> = Migrations<DBFullSchema>
>(database: Database<IsAsync, DBFullSchema, S, M>) {
  const queriesManager = useState("_tiki-db-queries-manager", () =>
    shallowRef(new QueriesManager<Ref>())
  );
  return new VueDatabaseWrapper<IsAsync, DBFullSchema, S, M>(
    database,
    VueCollectionWrapper,
    queriesManager.value
  );
}
