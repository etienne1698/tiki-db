import type { Model } from "../model/model";
import { Relation } from "./relation";

export class OneRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  multiple: false = false;
}
