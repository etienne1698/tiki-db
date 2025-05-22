import { Collection } from "../collection/collection";
import { CollectionSchema } from "../collection/collection_schema";
import { DatabaseFullSchema } from "../database/database";
import { QueriesManager } from "../query/queries_manager";
import { Query } from "../query/query";

export abstract class AsyncReactiveCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  ReactivePrimitive = unknown
> {
  constructor(
    private collection: Collection<true, Schema, DBFullSchema>,
    private queriesManager: QueriesManager<ReactivePrimitive>
  ) {}

  abstract setReactiveValue(oldVal: ReactivePrimitive, val: unknown): void;
  abstract createReactiveValue(val: unknown): ReactivePrimitive;

  async findFirst<
    Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>
  >(query: Q): Promise<unknown> {
    const queryHash = this.queriesManager.hashQuery(
      this.collection.schema,
      // @ts-ignore
      query,
      true
    );
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash);
    }
    const queryResult = await this.collection.findFirst(
      query as Parameters<typeof this.collection.findFirst>[0]
    );
    return this.queriesManager.set(
      queryHash,
      this.collection.schema,
      true,
      query,
      this.createReactiveValue(queryResult)
    );
  }

  async findMany<Q extends Query<Schema, DBFullSchema> = Query<Schema, DBFullSchema>>(
    query: Q
  ): Promise<unknown> {
    const queryHash = this.queriesManager.hashQuery(
      this.collection.schema,
      // @ts-ignore
      query,
      false
    );
    if (this.queriesManager.has(queryHash)) {
      return this.queriesManager.subscribe(queryHash);
    }
    const queryResult = await this.collection.findMany(
      query as Parameters<typeof this.collection.findMany>[0]
    );
    return this.queriesManager.set(
      queryHash,
      this.collection.schema,
      false,
      query,
      this.createReactiveValue(queryResult)
    );
  }

  async update(
    queryFilters: Parameters<typeof this.collection.update>[0],
    data: Parameters<typeof this.collection.update>[1]
  ) {
    const queryResult = await this.collection.update(queryFilters, data);
    return queryResult;
  }

  async remove(queryFilters: Parameters<typeof this.collection.remove>[0]) {
    const queryResult = await this.collection.remove(queryFilters);
    await this.reRunQueryConcernedByRemove(queryFilters);
    return queryResult;
  }

  async insert(
    data: Parameters<typeof this.collection.insert>[0],
    opts?: Parameters<typeof this.collection.insert>[1]
  ) {
    const queryResult = await this.collection.insert(data, opts);
    await this.reRunQueryConcerned(data);
    return queryResult;
  }

  async upsert(
    data: Parameters<typeof this.collection.upsert>[0],
    opts?: Parameters<typeof this.collection.upsert>[1]
  ) {
    const queryResult = await this.collection.upsert(data, opts);
    await this.reRunQueryConcerned(data);
    return queryResult;
  }

  async insertMany(
    data: Parameters<typeof this.collection.insertMany>[0],
    opts?: Parameters<typeof this.collection.insertMany>[1]
  ) {
    const queryResult = await this.collection.insertMany(data, opts);
    await this.reRunQueryConcerned(data);
    return queryResult;
  }

  async updateMany(
    queryFilters: Parameters<typeof this.collection.updateMany>[0],
    data: Parameters<typeof this.collection.updateMany>[1]
  ) {
    const queryResult = await this.collection.updateMany(queryFilters, data);
    await this.reRunQueryConcerned(data);
    return queryResult;
  }

  async upsertMany(
    data: Parameters<typeof this.collection.upsertMany>[0],
    opts?: Parameters<typeof this.collection.upsertMany>[1]
  ) {
    const queryResult = await this.collection.upsertMany(data, opts);
    await this.reRunQueryConcerned(data);
    return queryResult;
  }

  private async reRunQueryConcernedByRemove(queryFilters: any) {
    const queryCacheDataConcerned =
      this.queriesManager.getQueriesConcernedByRemove(
        this.collection.schema,
        queryFilters
      );
    for (const queryCacheData of queryCacheDataConcerned) {
      this.setReactiveValue(
        queryCacheData.result,
        queryCacheData.isFindFirst
          ? await this.collection.findFirst(
              queryCacheData.query as Parameters<
                typeof this.collection.findFirst
              >[0]
            )
          : await this.collection.findMany(
              queryCacheData.query as Parameters<
                typeof this.collection.findMany
              >[0]
            )
      );
    }
  }

  private async reRunQueryConcerned(data: any) {
    const queryCacheDataConcerned = this.queriesManager.getQueriesConcerned(
      this.collection.schema,
      data
    );
    for (const queryCacheData of queryCacheDataConcerned) {
      this.setReactiveValue(
        queryCacheData.result,
        queryCacheData.isFindFirst
          ? await this.collection.findFirst(
              queryCacheData.query as Parameters<
                typeof this.collection.findFirst
              >[0]
            )
          : await this.collection.findMany(
              queryCacheData.query as Parameters<
                typeof this.collection.findMany
              >[0]
            )
      );
    }
  }
}
