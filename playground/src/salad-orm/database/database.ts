import { Collection } from "../collections/collections";
import { Relations } from "../relations/relations";
import type { CollectionRelationalConfig, ExtractDatabaseWithRelations } from "../types";
import { is } from "../utils";

export type DatabaseRelationalConfig = Record<string, CollectionRelationalConfig>;


export function extractDatabaseRelationalConfig<
  DSchema extends DatabaseRelationalConfig
>(schema: Record<string, unknown>) {
  return Object.entries(schema).reduce((acc, [key, value]) => {
    if (is(value, Collection)) {
      acc[value.dbName] = {
        fields: value.schema.schema,
        dbName: value.dbName,
        tsName: key,
        primaryKey: "",
        relations: acc[value.dbName]?.relations || {},
      };
    } else if (is(value, Relations)) {
      acc[value.collectionName].relations = value.config;
    }
    return acc;
  }, {} as DatabaseRelationalConfig) as DSchema;
}

export class Database<
  DFullSchema extends Record<string, unknown>,
  DSchema extends DatabaseRelationalConfig
> {
  constructor(public fullSchema: DFullSchema, public schema: DSchema) {}
}

export function database<S extends Record<string, unknown>>(schema: S) {
  const dbSchema =
    extractDatabaseRelationalConfig<ExtractDatabaseWithRelations<S>>(schema);
  return new Database(schema, dbSchema);
}
