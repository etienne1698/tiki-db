import type { Model } from "../model/model";
import { Relation } from "./relation";

export class BelongsToRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  multiple: false = false;
}
