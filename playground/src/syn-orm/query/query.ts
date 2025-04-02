import type { Model } from "../model/model";
import type { InferModelFieldName } from "../types";

export enum Operator {
  EQ = 1,
  IN = 2,
  NE = 3,
}

export type OperatorValueType = {
  [Operator.EQ]: any;
  [Operator.IN]: Array<any>;
  [Operator.NE]: any;
};

export type Query<M extends Model> = {
  filters: Record<keyof OperatorValueType, Partial<Record<InferModelFieldName<M>, any>>>;
  with: Set<string>;
  primaries: Array<string>;
};
