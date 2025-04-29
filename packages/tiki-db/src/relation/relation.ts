import type { Model } from "../model/model";
import { InferModelFieldName } from "../types";

export abstract class Relation<
  M extends Model = Model,
  MRelated extends Model = Model
> {
  abstract multiple: boolean;

  declare model: M;
  constructor(
    public related: MRelated,
    public fields: InferModelFieldName<M>[],
    public references: InferModelFieldName<MRelated>[]
  ) {}
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
