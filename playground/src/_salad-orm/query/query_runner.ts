import type { Collection } from "../collection/collection";
import type { Database } from "../database/database";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";

export default class QueryRunner<D extends Database, C extends Collection> {
  constructor(private database: D, private collection: C) {}

  saveRelations(data: Record<string, any>) {
    return this.database.store.saveRelations(this.collection.relations, data);
  }

  saveOne(
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations: boolean = true
  ) {
    return this.database.store.saveOne(
      this.collection.model,
      data,
      saveRelations
    );
  }

  save(
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations: boolean = true
  ) {
    return this.database.store.save(this.collection.model, data, saveRelations);
  }

  delete(primary: string) {
    return this.database.store.delete(this.collection.model, primary);
  }

  /* query() {
    return this.database.query(this.model);
  } */

  all() {
    return this.database.store.get(this.collection.model);
  }

  getByPrimary(primary: Primary) {
    return this.database.store.getByPrimary(this.collection.model, primary);
  }
}
