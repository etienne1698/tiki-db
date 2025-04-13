import type { CollectionSchema } from "./collection_schema";
import type { Database } from "../database/database";
import type {
  AnyButMaybeT,
  DeepPartial,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { QueryResult, type Query } from "../query/query";

export class Collection<C extends CollectionSchema, D extends Database> {
  constructor(private database: D, private collection: C) {}

  saveRelations(data: Record<string, any>) {
    return this.database.saveRelations(this.collection, data);
  }

  saveOne(
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations: boolean = true
  ) {
    return this.database.saveOne(this.collection, data, saveRelations);
  }

  save(
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations: boolean = true
  ) {
    return this.database.save(this.collection, data, saveRelations);
  }

  delete(primary: string) {
    return this.database.delete(this.collection, primary);
  }

  query() {
    return this.database.query(this.collection);
  }

  find<Q extends DeepPartial<Query<C, D>>>(query: Q) {
    return this.database.find(this.collection, query) as unknown as QueryResult<C, D, Q>;
  }

  async findFirst<Q extends DeepPartial<Query<C, D>>>(query: Q) {
    return this.database.findFirst(this.collection, query) as unknown as QueryResult<C, D, Q>[0];
  }

  all() {
    return this.find({});
  }

  getByPrimary(primary: Primary) {
    return this.database.getByPrimary(this.collection, primary);
  }
}
