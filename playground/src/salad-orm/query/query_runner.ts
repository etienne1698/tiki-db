import type { Collection } from "../collection/collection";
import type { Database } from "../database/database";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { QueryBuilder } from "./query_builder";

export class QueryRunner<D extends Database, C extends Collection> {
  constructor(private database: D, private collection: C) {}

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
    return this.database.storage.delete(this.collection, primary);
  }

  query() {
    return new QueryBuilder(this.database.storage, this.collection);
  }

  all() {
    return this.database.storage.get(this.collection);
  }

  getByPrimary(primary: Primary) {
    return this.database.storage.getByPrimary(this.collection, primary);
  }
}
