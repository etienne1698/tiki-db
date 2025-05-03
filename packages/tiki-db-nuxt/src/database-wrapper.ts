import { Database, DatabaseFullSchema, Migrations, Storage } from "tiki-db";
import { VueDatabaseWrapper } from "tiki-db-vue";
import { NuxtCollectionWrapper } from "./collection-wrapper";
import { NuxtQueriesManager } from "./queries-manager";

export function nuxtDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
>(database: Database<IsAsync, FullSchema, S, M>) {
  return new VueDatabaseWrapper<IsAsync, FullSchema, S, M>(
    database,
    NuxtCollectionWrapper,
    new NuxtQueriesManager()
  );
}
