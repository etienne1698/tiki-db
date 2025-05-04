import {
  type DatabaseFullSchema,
  type Migrations,
  type Database,
  type Storage,
  QueriesManager,
} from "tiki-db";
import { VueCollectionWrapper, VueDatabaseWrapper } from "tiki-db-vue";

/**
 *
 * @param database
 * @param dbName set this if you have multiple databases
 */
export function useDB<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
>(database: Database<IsAsync, FullSchema, S, M>, dbName: string = "_dbName") {
  const queriesManager = useState(dbName, () =>
    shallowRef(new QueriesManager<Ref>())
  );
  return new VueDatabaseWrapper<IsAsync, FullSchema, S, M>(
    database,
    VueCollectionWrapper,
    queriesManager.value
  );
}
