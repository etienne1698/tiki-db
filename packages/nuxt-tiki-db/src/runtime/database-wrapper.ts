import type {
  Database,
  DatabaseFullSchema,
  Migrations,
  QueriesManager,
  Storage,
} from "tiki-db";
import { VueCollectionWrapper, VueDatabaseWrapper } from "tiki-db-vue";
import type { Ref } from "vue";

export function nuxtDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
>(
  database: Database<IsAsync, FullSchema, S, M>,
  queriesManager: QueriesManager<Ref>
) {
  return new VueDatabaseWrapper<IsAsync, FullSchema, S, M>(
    database,
    VueCollectionWrapper,
    queriesManager
  );
}
