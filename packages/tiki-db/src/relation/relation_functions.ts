import type { Model } from "../model/model";
import { InferModelFieldName } from "../types";
import { OneRelation } from "./one";
import { ManyRelation } from "./many";
import { Relations, type Relation } from "./relation";

type RelationSetupParams<M extends Model, MRelated extends Model = Model> = {
  fields: InferModelFieldName<M>[];
  references: InferModelFieldName<MRelated>[];
};

export function many<M extends Model, MRelated extends Model = Model>(
  model: MRelated,
  params: RelationSetupParams<M, MRelated>
) {
  return new ManyRelation(model, params.fields, params.references);
}

export function one<M extends Model, MRelated extends Model = Model>(
  model: MRelated,
  params: RelationSetupParams<M, MRelated>
) {
  return new OneRelation(model, params.fields, params.references);
}

type RelationSetupFn<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  many: <MRelated extends Model>(
    model: MRelated,
    params: RelationSetupParams<M, MRelated>
  ) => ReturnType<typeof many<M, MRelated>>;
  one: <MRelated extends Model>(
    model: MRelated,
    params: RelationSetupParams<M, MRelated>
  ) => ReturnType<typeof one<M, MRelated>>;
}) => R;

export function relations<
  M extends Model,
  R extends Record<string, Relation> = Record<string, Relation>
>(model: M, setup: RelationSetupFn<M, R>) {
  return new Relations(model, setup({ many, one }));
}
