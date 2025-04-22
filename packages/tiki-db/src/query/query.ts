import type { CollectionSchema } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
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

export type Query<
  C extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> = {
  filters: QueryFilters<C> & QueryOrFilters<C>;
  with: {
    [K in keyof C["relations"]["schema"]]?: C["relations"]["schema"][K]["related"]["dbName"] extends keyof DBFullSchema["schemaDbName"]
      ?
          | boolean
          | Query<
              DBFullSchema["schemaDbName"][C["relations"]["schema"][K]["related"]["dbName"]],
              DBFullSchema
            >
      : boolean;
  };
};

export function createDefaultQuery<
  C extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
>(): Query<C, DBFullSchema> {
  return {
    filters: {},
    with: {},
  };
}

export type QueryResult<
  C extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  Q extends DeepPartial<Query<C, DBFullSchema>> = Query<C, DBFullSchema>
> = Array<
  InferModelNormalizedType<C["model"]> & {
    [K in keyof Q["with"]]: K extends keyof C["relations"]["schema"]
      ? Q["with"][K] extends true
        ? C["relations"]["schema"][K]["multiple"] extends true
          ? InferModelNormalizedType<C["relations"]["schema"][K]["related"]>[]
          :
              | InferModelNormalizedType<C["relations"]["schema"][K]["related"]>
              | undefined
        : never
      : never;
  }
>;
