import type { Collection } from "../collection/collection";
import type { Database } from "../database/database";
import type {
  AnyButMaybeT,
  DeepPartial,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { createDefaultQuery, type Query } from "./query";
import { QueryBuilder } from "./query_builder";

export class QueryRunner<
  C extends Collection,
  Collections extends Record<string, Collection> = Record<string, Collection>
> {
  constructor(private database: Database<Collections>, private collection: C) {}

  saveRelations(data: Record<string, any>) {
    return this.database.storage.saveRelations(this.collection.relations, data);
  }

  saveOne(
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations: boolean = true
  ) {
    return this.database.storage.saveOne(this.collection, data, saveRelations);
  }

  save(
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations: boolean = true
  ) {
    return this.database.storage.save(this.collection, data, saveRelations);
  }

  delete(primary: string) {
    return this.database.storage.remove(this.collection, primary);
  }

  query() {
    return new QueryBuilder(this.database.storage, this.collection);
  }

  find(query: DeepPartial<Query<C>>) {
    const finalQuery = Object.assign(createDefaultQuery<C>(), query);
    return this.database.storage.get(this.collection, finalQuery);
  }

  findFirst(query: DeepPartial<Query<C>>) {
    return this.find(query)?.[0];
  }

  all() {
    return this.database.storage.get(this.collection);
  }

  getByPrimary(primary: Primary) {
    return this.database.storage.getByPrimary(this.collection, primary);
  }
}
