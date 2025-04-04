import type { Collection } from "../collection/collection";
import { Database } from "../database/database";
import type { InferModelFieldName } from "../types";

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

export type Query<C extends Collection, D extends Database> = {
  filters: QueryFilters<C> & QueryOrFilters<C>;
  primaries: Array<string>;
  with: {
    [K in keyof C["relations"]["schema"]]?: C["relations"]["schema"][K]["related"]["dbName"] extends keyof D["mapCollectionDbNameCollection"]
      ?
          | boolean
          | Query<
              D["mapCollectionDbNameCollection"][C["relations"]["schema"][K]["related"]["dbName"]],
              D
            >
      : boolean;
  };
};

export function createDefaultQuery<
  C extends Collection,
  D extends Database
>(): Query<C, D> {
  return {
    filters: {},
    primaries: [],
    with: {},
  };
}
