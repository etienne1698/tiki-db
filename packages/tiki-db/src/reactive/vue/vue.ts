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
  AsyncReactiveCollectionWrapper,
  Storage,
} from "../..";
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

class VueAsyncCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> extends AsyncReactiveCollectionWrapper<Schema, DBFullSchema> {
  createReactiveValue<T>(val: T): Ref<T> {
    return ref(val) as Ref<T>;
  }

  setReactiveValue<T>(oldVal: Ref<T>, val: T): void {
    oldVal.value = val;
  }
}

export function vueDatabaseWrapper<
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, false> = Storage<FullSchema, false>
>(database: Database<false, FullSchema, S>) {
  return new ReactiveDatabaseWrapper<false, FullSchema, S>(
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

export function vueAsyncDatabaseWrapper<
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, true> = Storage<FullSchema, true>
>(database: Database<true, FullSchema, S>) {
  return new ReactiveDatabaseWrapper<true, FullSchema, S>(
    database,
    VueAsyncCollectionWrapper,
    new QueriesManager<Ref>()
  ) as ReactiveDatabaseWrapper<true, FullSchema, S> & {
    collections: {
      [K in keyof FullSchema["schema"]]: IVueCollectionWrapper<
        true,
        FullSchema["schema"][K],
        FullSchema
      >;
    };
  };
}
