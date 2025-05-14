import type { Model } from "./model/model";
import type { Field } from "./model/field";
import { CollectionSchema } from "./collection/collection_schema";
import { DatabaseFullSchema } from "./database/database";

export type DeepPartial<T> = Partial<{
  [P in keyof T]?: DeepPartial<T[P]>;
}>;

export type AnyButMaybeT<T> = DeepPartial<T> & Record<string, any>;

export type PrimaryKey = string | string[];
export type Primary = string;

export type InferModelNormalizedType<M extends Model> = {
  [K in keyof M["schema"]]: M["schema"][K]["defaultValue"];
};

export type InferModelNormalizedInDatabaseType<M extends Model> = {
  [K in keyof M["schema"] as M["schema"][K]["dbName"]]: M["schema"][K]["defaultValue"];
};

export type InferModelFieldName<M extends Model> = keyof M["schema"];

export type InferNormalizedField<F extends Field> = ReturnType<F["normalize"]>;

// TODO: Some fields are not optionnal on insert
export type InferCollectionInsert<
  C extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema
> = Partial<{
  [key in keyof C["model"]["schema"]]: C["model"]["schema"][key]["defaultValue"];
}> &
  Partial<{
    [key in keyof C["relations"]["schema"]]: InferCollectionInsert<
      DBFullSchema["schemaDbName"][C["relations"]["schema"][key]["model"]["dbName"]],
      DBFullSchema
    >;
  }>;

export type InferCollectionUpdate<
  C extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema
> = Partial<{
  [key in keyof C["model"]["schema"]]: C["model"]["schema"][key]["defaultValue"];
}> &
  Partial<{
    [key in keyof C["relations"]["schema"]]: InferCollectionInsert<
      DBFullSchema["schemaDbName"][C["relations"]["schema"][key]["model"]["dbName"]],
      DBFullSchema
    >;
  }>;
