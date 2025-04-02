import type { Database } from "../database";
import type { Model, Primary } from "../model";
import type { InferNormalizedSchema } from "../schema/schema";
import type { AnyButMaybeT, MaybeAsArray } from "../types";

export class Collection<M extends Model, D extends Database = Database> {
  declare relations: ReturnType<M["relations"]>;

  constructor(public database: D, public model: M) {
    this.relations = this.model.relations() as ReturnType<M["relations"]>;
  }

  saveRelations(data: Record<string, any>) {
    return this.database.store.saveRelations(this.model, data);
  }

  saveOne(data: AnyButMaybeT<InferNormalizedSchema<M['schema']>>, saveRelations: boolean = true) {
    return this.database.store.saveOne(this.model, data, saveRelations);
  }
 
  save(data: MaybeAsArray<AnyButMaybeT<InferNormalizedSchema<M['schema']>>>, saveRelations: boolean = true) {
    return this.database.store.save(this.model, data, saveRelations);
  }

  delete(primary: string) {
    return this.database.store.delete(this.model, primary);
  }

  query() {
    return this.database.query(this.model);
  }

  all() {
    return this.database.store.get(this.model);
  }

  getByPrimary(primary: Primary) {
    return this.database.store.getByPrimary(this.model, primary);
  }
}
