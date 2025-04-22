import type { Model } from "../model/model";

export abstract class Relation<
  M extends Model = Model,
  MRelated extends Model = Model
> {
  abstract multiple: boolean;

  declare model: M;
  constructor(public related: MRelated, public field: unknown) {}
}

export class Relations<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public model: M, public schema: R) {
    for (const key in this.schema) {
      this.schema[key].model = this.model;
    }
  }
}
