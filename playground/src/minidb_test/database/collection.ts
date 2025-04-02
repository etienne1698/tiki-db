import type { Model } from "../model";

export class Collection<M extends Model> {
  declare relations: ReturnType<M["relations"]>;

  constructor(public model: M) {
    this.relations = this.model.relations() as ReturnType<M["relations"]>;
  }
}
