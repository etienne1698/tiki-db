import {
  Collection,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  QueriesManager,
  Query,
  QueryResult,
  ReactiveCollectionWrapper,
  ReactiveDatabaseWrapper,
  Storage,
} from "tiki-db";
import { ref, Ref } from "vue";

type IVueCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> = Omit<
  Collection<IsAsync, Schema, DBFullSchema>,
  "findMany" | "findFirst" | "schema" | "database" | "query"
> & {
  findMany<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ): Ref<QueryResult<Schema, DBFullSchema, Q>>;

  findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(
    query: Q
  ): Ref<QueryResult<Schema, DBFullSchema, Q>[0]>;
};

class VueCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> extends ReactiveCollectionWrapper<Schema, DBFullSchema> {
  createReactiveValue<T>(val: T): Ref<T> {
    return ref(val) as Ref<T>;
  }

  setReactiveValue<T>(oldVal: Ref<T>, val: T): void {
    oldVal.value = val;
  }
}

export function vueDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(database: Database<IsAsync, FullSchema, S>) {
  return new ReactiveDatabaseWrapper<IsAsync, FullSchema, S>(
    database,
    VueCollectionWrapper,
    new QueriesManager<Ref>()
  ) as ReactiveDatabaseWrapper & {
    collections: {
      [K in keyof FullSchema["schema"]]: IVueCollectionWrapper<
        false,
        FullSchema["schema"][K],
        FullSchema
      >;
    };
  };
}
