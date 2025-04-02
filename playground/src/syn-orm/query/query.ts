import type { Model } from "../model/model";
import type { InferModelFieldName } from "../types";

export enum Operator {
  EQ = 1,
  IN = 2,
  NE = 3,
}

export type OperatorValueType = {
  1: any;
  2: Array<any>;
  3: any;
};

export type Query<M extends Model> = {
  filters: Record<Operator, Partial<Record<InferModelFieldName<M>, any>>>;
  with: Set<string>;
  primaries: Array<string>;
};
