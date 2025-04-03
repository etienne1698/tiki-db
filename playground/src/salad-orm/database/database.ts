import { Collection } from "../collections/collections";
import { Relations } from "../relations/relations";
import type {
  CollectionFullSchema,
  ExtractDatabaseSchema,
} from "../types";
import { is } from "../utils";
import type { Datastore } from "./datastore";

export type DatabaseSchema = Record<string, CollectionFullSchema>;

export function extractDatabaseSchema<TSchema extends DatabaseSchema>(
  schema: Record<string, unknown>
) {
  return Object.entries(schema).reduce((acc, [key, value]) => {
    if (is(value, Collection)) {
      acc[value.dbName] = {
        fields: value.schema,
        dbName: value.dbName,
        tsName: key,
        primaryKey: "",
        relations: acc[value.dbName]?.relations || {},
      };
    } else if (is(value, Relations)) {
      acc[value.collectionName].relations = value.config;
    }
    return acc;
  }, {} as DatabaseSchema) as TSchema;
}

export class Database<
  TFullSchema extends Record<string, unknown>,
  TSchema extends DatabaseSchema
> {
  constructor(
    public fullSchema: TFullSchema,
    public schema: TSchema,
    public datastore: Datastore
  ) {}
}

export function setupDatabase<TFullSchema extends Record<string, unknown>>(
  datastore: Datastore,
  schema: TFullSchema
) {
  const dbSchema =
    extractDatabaseSchema<ExtractDatabaseSchema<TFullSchema>>(schema);
  return new Database(schema, dbSchema, datastore);
}
