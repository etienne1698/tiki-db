import { Collection, CollectionSchema, DatabaseFullSchema } from "tiki-db";
import { ref, Ref } from "vue";
import { QueriesManager } from "./queries-manager";

/**
 * This interface feels pointless — it just forces me to re-implement every method from the wrapped collection.
 */
export type IVueCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  C extends Collection<IsAsync, Schema, DBFullSchema> = Collection<
    IsAsync,
    Schema,
    DBFullSchema
  >
> = {
  [K in keyof Omit<C, "database" | "schema" | "query">]: C[K] extends (
    ...args: any
  ) => any
    ? K extends "find" | "findFirst"
      ? (...args: Parameters<C[K]>) => Ref<ReturnType<C[K]>>
      : (...args: Parameters<C[K]>) => ReturnType<C[K]>
    : never;
};

export class VueCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements IVueCollectionWrapper<false, Schema, DBFullSchema>
{
  constructor(
    private collection: Collection<false, Schema, DBFullSchema>,
    private queriesManager: QueriesManager
  ) {}

  findFirst(query: Parameters<typeof this.collection.findFirst>[0]) {
    const queryHash = this.queriesManager.hashQuery(query, true);
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash) as Ref<
        ReturnType<typeof this.collection.findFirst>
      >;
    }
    const queryResult = this.collection.findFirst(query);
    return this.queriesManager.set(queryHash, ref(queryResult)) as Ref<
      ReturnType<typeof this.collection.findFirst>
    >;
  }

  find(query: Parameters<typeof this.collection.find>[0]) {
    const queryHash = this.queriesManager.hashQuery(query, false);
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash) as Ref<
        ReturnType<typeof this.collection.find>
      >;
    }
    const queryResult = this.collection.find(query);
    return this.queriesManager.set(queryHash, ref(queryResult)) as Ref<
      ReturnType<typeof this.collection.find>
    >;
  }

  update(
    primary: Parameters<typeof this.collection.update>[0],
    data: Parameters<typeof this.collection.update>[1]
  ) {
    const queryResult = this.collection.update(primary, data);
    return queryResult;
  }

  insert(data: Parameters<typeof this.collection.insert>[0]) {
    const queryResult = this.collection.insert(data);
    return queryResult;
  }
}
