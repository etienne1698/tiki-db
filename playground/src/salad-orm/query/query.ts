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

export type QueryFilters<C extends Collection> = DeepPartial<{
  [field in InferModelFieldName<C["model"]>]: {
    [key in Filters]: FiltersValueType[key];
  };
}>;

export enum AndOrFilters {
  AND = "$and",
  OR = "$or",
}

export type AndOrFiltersValueType = {
  [AndOrFilters.AND]: Array<any>;
  [AndOrFilters.OR]: Array<any>;
};

export type QueryAndOrFilters<C extends Collection> = DeepPartial<{
  [key in AndOrFilters]: QueryFilters<C> & {
    [key in AndOrFilters]: QueryFilters<C>;
  };
}>;

/**
 * Example:
  {
    filters: {
      $or: {
        $and: {
          id: {
            $eq: "123",
          },
          firstname: { $eq: "John" },
        },
        lastname: { $eq: "Doe" },
      },
      email: {
        $eq: "1",
      },
    },
  }
 */
export type Query<C extends Collection> = {
  filters: QueryFilters<C> & QueryAndOrFilters<C>;
  with: Set<string>;
  primaries: Array<string>;
};

export function createDefaultQuery<C extends Collection>(): Query<C> {
  return {
    filters: {},
    with: new Set<string>(),
    primaries: [],
  };
}
