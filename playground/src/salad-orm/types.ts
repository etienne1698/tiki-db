import type { Collection } from "./collections/collections";
import type { Relation, Relations } from "./relations/relations";
import type { Field } from "./schema/field";
import type { Schema } from "./schema/schema";

export type MaybeAsArray<T> = T | T[];

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type AnyButMaybeT<T> = DeepPartial<T> & Record<string, any>;

export type PrimaryKey = string | string[];
export type Primary = string;

export type ExtractObjectValues<T> = T[keyof T];

export type CollectionRelationsKeysOnly<
  TSchema extends Record<string, unknown>,
  TCollectionName extends string,
  K extends keyof TSchema
> = TSchema[K] extends Relations<TCollectionName> ? K : never;

export type ExtractCollectionRelationsFromSchema<
  TSchema extends Record<string, unknown>,
  TCollectionName extends string
> = ExtractObjectValues<{
  [K in keyof TSchema as CollectionRelationsKeysOnly<
    TSchema,
    TCollectionName,
    K
  >]: TSchema[K] extends Relations<TCollectionName, infer TConfig>
    ? TConfig
    : never;
}>;

export type ExtractDatabaseWithRelations<
  TSchema extends Record<string, unknown>
> = {
  [K in keyof TSchema as TSchema[K] extends Collection
    ? K
    : never]: TSchema[K] extends Collection
    ? {
        tsName: K & string;
        dbName: TSchema[K]["dbName"];
        fields: TSchema[K]["schema"]["schema"];
        relations: ExtractCollectionRelationsFromSchema<
          TSchema,
          TSchema[K]["dbName"]
        >;
        primaryKey: string;
      }
    : never;
};

export interface CollectionRelationalConfig {
  dbName: string;
  tsName: string;
  relations: Record<string, Relation>;
  fields: Record<string, Field>;
  primaryKey: PrimaryKey;
}

export type InferNormalizedSchema<S extends Schema> = ReturnType<
  S["normalize"]
>;

export type InferNormalizedField<F extends Field> = ReturnType<F["normalize"]>;
