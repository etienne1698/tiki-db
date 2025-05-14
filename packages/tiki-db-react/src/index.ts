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
import { Signal, signal } from "@preact/signals-react";

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
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(database: Database<IsAsync, FullSchema, S>) {
  return new ReactiveDatabaseWrapper<IsAsync, FullSchema, S>(
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
