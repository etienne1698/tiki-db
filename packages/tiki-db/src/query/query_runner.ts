import type { Collection } from "../collection/collection";
import type { Database } from "../database/database";
import type {
  AnyButMaybeT,
  DeepPartial,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { type Query } from "./query";

export class QueryRunner<C extends Collection, D extends Database> {
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

  find(query: DeepPartial<Query<C, D>>) {
    return this.database.find(this.collection, query);
  }

  findFirst(query: DeepPartial<Query<C, D>>) {
    return this.database.findFirst(this.collection, query);
  }

  all() {
    return this.find({});
  }

  getByPrimary(primary: Primary) {
    return this.database.getByPrimary(this.collection, primary);
  }
}
