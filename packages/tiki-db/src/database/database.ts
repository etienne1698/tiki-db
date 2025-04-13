import { Collection } from "../collection/collection";
import type { Storage } from "../storage/storage";
import { QueryRunner } from "../query/query_runner";
import {
  AnyButMaybeT,
  Constructor,
  DeepPartial,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { QueryBuilder } from "../query/query_builder";
import { createDefaultQuery, Query } from "../query/query";

export class Database<
  S extends Storage<false> = Storage<false>,
  PersistantStorage extends Storage<true> = Storage<true>,
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  declare storage: S;
  declare persistentStorage: PersistantStorage;

  collections: {
    [K in keyof Collections]: QueryRunner<Collections[K], typeof this>;
  } = {} as {
    [K in keyof Collections]: QueryRunner<Collections[K], typeof this>;
  };

  mapCollectionDbNameCollection: {
    [K in keyof Collections as Collections[K]["model"]["dbName"]]: Collections[K];
  } = {} as {
    [K in keyof Collections as Collections[K]["model"]["dbName"]]: Collections[K];
  };

  constructor(
    collections: Collections,
    storage: Constructor<S>,
    persistentStorage: Constructor<PersistantStorage>
  ) {
    this.storage = new storage(this);
    this.persistentStorage = new persistentStorage(this);

    for (const [key, collection] of Object.entries(collections)) {
      // @ts-ignore
      collections[key] = new QueryRunner(this, collection);
      // @ts-ignore
      this.mapCollectionDbNameCollection[collection.model.dbName] = collection;
      this.storage.load(collection);
      this.persistentStorage.load(collection);
    }
  }

  query<C extends Collection, D extends Database = typeof this>(
    collection: C,
    query?: Query<C, D>
  ) {
    return new QueryBuilder(this, collection, query as Query<C, typeof this>);
  }

  async saveRelations<C extends Collection>(
    collection: C,
    data: Record<string, any>
  ) {
    await this.persistentStorage.saveRelations(collection.relations, data);
    return this.storage.saveRelations(collection.relations, data);
  }

  async saveOne<C extends Collection>(
    collection: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations: boolean = true
  ) {
    await this.persistentStorage.saveOne(collection, data, saveRelations);
    return this.storage.saveOne(collection, data, saveRelations);
  }

  async save<C extends Collection>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations: boolean = true
  ) {
    await this.persistentStorage.save(collection, data, saveRelations);
    return this.storage.save(collection, data, saveRelations);
  }

  async delete<C extends Collection>(collection: C, primary: string) {
    await this.persistentStorage.remove(collection, primary);
    return this.storage.remove(collection, primary);
  }

  async find<C extends Collection, D extends Database = typeof this>(
    collection: C,
    query: DeepPartial<Query<C, D>>
  ) {
    const finalQuery = Object.assign(createDefaultQuery<C, D>(), query);
    const data = await this.persistentStorage.get(
      collection,
      finalQuery as Query<C, D>
    );
    this.storage.save(collection, data, true);
    return this.storage.get(collection, finalQuery as Query<C, D>);
  }

  async findFirst<C extends Collection, D extends Database = typeof this>(
    collection: C,
    query: DeepPartial<Query<C, D>>
  ) {
    return (await this.find(collection, query))?.[0];
  }

  async getByPrimary<C extends Collection>(collection: C, primary: Primary) {
    const data = await this.persistentStorage.getByPrimary(collection, primary);
    if (data) {
      this.storage.save(collection, data, true);
    }
    return this.storage.getByPrimary(collection, primary);
  }
}

export function database<
  S extends Storage<false> = Storage<false>,
  PersistantStorage extends Storage<true> = Storage<true>,
  Collections extends Record<string, Collection> = Record<string, Collection>
>(
  collections: Collections,
  storage: Constructor<S>,
  persistentStorage: Constructor<PersistantStorage>
) {
  return new Database(collections, storage, persistentStorage);
}
