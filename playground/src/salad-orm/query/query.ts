import type { Collection } from "../collection/collection";
import type { DeepPartial, InferModelFieldName } from "../types";

export enum Filters {
  EQ = "$eq",
  IN = "$in",
  NE = "$ne",
}

export type FiltersValueType = {
  [Filters.EQ]: string | number | boolean | null;
  [Filters.IN]: Array<any>;
  [Filters.NE]: any;
};

export type QueryFilters<C extends Collection> = Partial<{
  [field in InferModelFieldName<C["model"]>]: Partial<{
    [key in Filters]: FiltersValueType[key];
  }>;
}>;

export const FILTER_OR = "$or";

export type QueryOrFilters<C extends Collection> = Partial<{
  [FILTER_OR]: QueryFilters<C>[];
}>;

export type Query<C extends Collection> = {
  filters: QueryFilters<C> & QueryOrFilters<C>;
  primaries: Array<string>;
};

export function createDefaultQuery<C extends Collection>(): Query<C> {
  return {
    filters: {},
    primaries: [],
  };
}
