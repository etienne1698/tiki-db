import type Model from "./Model";
import type { Constructor } from "./types";

export type hasManyRelation<M extends Model> = {
  relatedModel: Constructor<M>;
  field: string;
};

export type hasManyThroughRelation<M extends Model, M2 extends Model> = {
  relatedModel: Constructor<M>;
  relatedModel2: Constructor<M2>;
  field_related1: keyof M;
  field_related2: keyof M2;
};

export type Relation<M extends Model = Model, M2 extends Model = Model> =
  | hasManyRelation<M>
  | hasManyThroughRelation<M, M2>;
