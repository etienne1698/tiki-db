import type { Model } from "../model/model";
import { Relation } from "./relation";

export class HasManyThrough<
  M extends Model = Model,
  MRelated extends Model = Model,
  MThrough extends Model = Model
> extends Relation<M, MRelated> {
  multiple: true = true;

  constructor(
    public related: MRelated,
    public field: unknown,
    public throughModel: MThrough,
    public throughField: unknown
  ) {
    super(related, field);
  }
}
