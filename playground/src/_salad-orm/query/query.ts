import type { Model } from "../model/model";
import type { InferModelFieldName } from "../types";

export enum Operator {
  EQ = "$eq",
  IN = "$in",
  NE = "$ne",
}

export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Query<M extends Model> = {
  filters: Record<
    keyof OperatorValueType,
    Partial<Record<InferModelFieldName<M>, any>>
  >;
  with: Set<string>;
  primaries: Array<string>;
};
