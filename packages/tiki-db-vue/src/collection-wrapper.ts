import {
  Collection,
  CollectionSchema,
  DatabaseFullSchema,
  Query,
  QueryResult,
} from "tiki-db";
import { ref, Ref } from "vue";
import { QueriesManager } from "./queries-manager";

export type IVueCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> = Omit<
  Collection<IsAsync, Schema, DBFullSchema>,
  "find" | "findFirst" | "schema" | "database" | "query"
> & {
  find<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ): Ref<QueryResult<Schema, DBFullSchema, Q>>;

  findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(
    query: Q
  ): Ref<QueryResult<Schema, DBFullSchema, Q>[0]>;
};

export abstract class AbstractVueCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements IVueCollectionWrapper<false, Schema, DBFullSchema>
{
  constructor(
    private collection: Collection<false, Schema, DBFullSchema>,
    private queriesManager: QueriesManager
  ) {}

  abstract createRef(queryHash: string, queryResult: unknown): Ref;

  findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(query: Q) {
    const queryHash = this.queriesManager.hashQuery(
      this.collection.schema,
      query as Parameters<typeof this.collection.findFirst>[0],
      true
    );
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash) as Ref<
        QueryResult<Schema, DBFullSchema, Q>[0]
      >;
    }
    const queryResult = this.collection.findFirst(
      query as Parameters<typeof this.collection.findFirst>[0]
    );
    return this.queriesManager.set(
      queryHash,
      this.collection.schema,
      true,
      query,
      this.createRef(queryHash, queryResult)
    ) as Ref<QueryResult<Schema, DBFullSchema, Q>[0]>;
  }

  find<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ) {
    const queryHash = this.queriesManager.hashQuery(
      this.collection.schema,
      query as Parameters<typeof this.collection.find>[0],
      false
    );
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash) as Ref<
        QueryResult<Schema, DBFullSchema, Q>
      >;
    }
    const queryResult = this.collection.find(
      query as Parameters<typeof this.collection.find>[0]
    );
    return this.queriesManager.set(
      queryHash,
      this.collection.schema,
      false,
      query,
      this.createRef(queryHash, queryResult)
    ) as Ref<QueryResult<Schema, DBFullSchema, Q>>;
  }

  update<Q extends Query<Schema, DBFullSchema>>(
    query: Parameters<typeof this.collection.update>[0],
    data: Parameters<typeof this.collection.update>[1]
  ) {
    const queryResult = this.collection.update(query, data);
    return queryResult;
  }

  remove(query: Parameters<typeof this.collection.update>[0]) {
    const queryResult = this.collection.remove(query);
    return queryResult;
  }

  insert(
    data: Parameters<typeof this.collection.insert>[0],
    opts?: Parameters<typeof this.collection.insert>[1]
  ) {
    const queryResult = this.collection.insert(data, opts);
    this.reRunQueryConcerned(data);
    return queryResult;
  }

  upsert(
    data: Parameters<typeof this.collection.upsert>[0],
    opts?: Parameters<typeof this.collection.upsert>[1]
  ) {
    const queryResult = this.collection.upsert(data, opts);
    this.reRunQueryConcerned(data);
    return queryResult;
  }

  reRunQueryConcerned(data: any) {
    const queryCacheDataConcerned = this.queriesManager.getQueriesConcerned(
      this.collection.schema,
      data
    );
    for (const queryCacheData of queryCacheDataConcerned) {
      queryCacheData.result.value = queryCacheData.isFindFirst
        ? this.collection.findFirst(
            queryCacheData.query as Parameters<
              typeof this.collection.findFirst
            >[0]
          )
        : this.collection.find(
            queryCacheData.query as Parameters<typeof this.collection.find>[0]
          );
    }
  }
}

export class VueCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> extends AbstractVueCollectionWrapper<Schema, DBFullSchema> {
  createRef(_queryHash: string, queryResult: unknown) {
    return ref(queryResult);
  }
}
