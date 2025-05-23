import {
  Collection,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  QueriesManager,
  Query,
  QueryResult,
  Storage,
} from "../..";
import { Signal, signal } from "@preact/signals-react";
import { ReactiveCollectionWrapper } from "../collection_wrapper";
import { ReactiveDatabaseWrapper } from "../database_wrapper";

export type IReactCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> = Omit<
  Collection<IsAsync, Schema, DBFullSchema>,
  "findMany" | "findFirst" | "schema" | "database" | "query"
> & {
  findMany<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ): Signal<QueryResult<Schema, DBFullSchema, Q>>;

  findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(
    query: Q
  ): Signal<QueryResult<Schema, DBFullSchema, Q>[0]>;
};

class ReactCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> extends ReactiveCollectionWrapper<Schema, DBFullSchema> {
  createReactiveValue<T>(val: T): Signal<T> {
    return signal(val);
  }

  setReactiveValue<T>(oldVal: Signal<T>, val: T): void {
    oldVal.value = val;
  }
}

export function reactDatabaseWrapper<
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, false> = Storage<FullSchema, false>
>(database: Database<false, FullSchema, S>) {
  return new ReactiveDatabaseWrapper<false, FullSchema, S>(
    database,
    ReactCollectionWrapper,
    new QueriesManager<Signal>()
  ) as ReactiveDatabaseWrapper & {
    collections: {
      [K in keyof FullSchema["schema"]]: IReactCollectionWrapper<
        false,
        FullSchema["schema"][K],
        FullSchema
      >;
    };
  };
}
