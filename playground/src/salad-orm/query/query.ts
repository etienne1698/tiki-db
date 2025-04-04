import type { Collection } from "../collection/collection";
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

export type Query<C extends Collection> = {
  filters: Record<
    keyof OperatorValueType,
    Partial<Record<InferModelFieldName<C["model"]>, any>>
  >;
  with: Set<string>;
  primaries: Array<string>;
};
