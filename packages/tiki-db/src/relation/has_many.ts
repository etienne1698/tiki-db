import type { Model } from "../model/model";
import { Relation } from "./relation";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  multiple: true = true;
}
