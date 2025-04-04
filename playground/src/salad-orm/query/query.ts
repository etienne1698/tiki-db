import type { Collection } from "../collection/collection";
import type { DeepPartial, InferModelFieldName } from "../types";

export enum Operator {
  EQ = "$eq",
  IN = "$in",
  NE = "$ne",
}

export type OperatorValueType = {
  [Operator.EQ]: any;
  [Operator.IN]: Array<any>;
  [Operator.NE]: any;
};

export type QueryFilters<C extends Collection> = {
  [key in Operator]: Partial<{
    [field in InferModelFieldName<C["model"]>]: OperatorValueType[key];
  }>;
};

export type Query<C extends Collection> = {
  filters: QueryFilters<C>;
  with: Set<string>;
  primaries: Array<string>;
};

export function createDefaultQuery<C extends Collection>(): Query<C> {
  return {
    filters: {
      [Operator.EQ]: {},
      [Operator.IN]: {},
      [Operator.NE]: {},
    },
    with: new Set<string>(),
    primaries: [],
  };
}
