import type { CollectionSchema } from "../collection/collection_schema";
import { Database } from "../database/database";
import type {
  DeepPartial,
  InferModelFieldName,
  InferModelNormalizedType,
} from "../types";

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

export type QueryFilters<C extends CollectionSchema> = Partial<{
  [field in InferModelFieldName<C["model"]>]: Partial<{
    [key in Filters]: FiltersValueType[key];
  }>;
}>;

export const FILTER_OR = "$or";

export type QueryOrFilters<C extends CollectionSchema> = Partial<{
  [FILTER_OR]: QueryFilters<C>[];
}>;

export type Query<C extends CollectionSchema, D extends Database = Database> = {
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
  C extends CollectionSchema,
  D extends Database
>(): Query<C, D> {
  return {
    filters: {},
    primaries: [],
    with: {},
  };
}

export type QueryResult<
  C extends CollectionSchema,
  D extends Database = Database,
  Q extends DeepPartial<Query<C, D>> = Query<C, D>
> = Array<
  InferModelNormalizedType<C["model"]> & {
    [K in keyof Q["with"]]: K extends keyof C["relations"]["schema"]
      ? Q["with"][K] extends true
        ? ReturnType<C["relations"]["schema"][K]['getFor']>
        : never
      : never;
  }
>;
