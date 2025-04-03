import { expect, test } from "vitest";
import type { Field } from "./schema/field";
import { Schema } from "./schema/schema";
import { string } from "./schema/string";
import type { PrimaryKey } from "./types";

function is<T extends abstract new (...args: any) => any>(
  value: any,
  type: T
): value is InstanceType<T> {
  return value instanceof type;
}

class Collection<
  CollectionName extends string = string,
  S extends Schema = Schema
> {
  constructor(public dbName: CollectionName, public schema: S) {}
}

class Relation<RefCName extends string = string> {
  declare referencedCollectionName: RefCName;

  constructor(
    referencedCollection: Collection<RefCName>,
    public field: string
  ) {
    this.referencedCollectionName = referencedCollection.dbName;
  }
}

class HasMany<RefCName extends string = string> extends Relation<RefCName> {}

class BelongsTo<RefCName extends string = string> extends Relation<RefCName> {}

class Relations<
  CollectionName extends string = string,
  Config extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(
    public collectionName: CollectionName,
    public config: Config
  ) {}
}

function collection<
  CollectionName extends string,
  S extends Record<string, Field> = Record<string, Field>
>(collectionName: CollectionName, schema: S) {
  return new Collection<CollectionName>(collectionName, new Schema<S>(schema));
}

function hasMany<RefC extends Collection>(
  referencedCollection: RefC,
  field: keyof RefC["schema"]["schema"]
) {
  return new HasMany(referencedCollection, field as string);
}
function belongsTo<C extends Collection, RefC extends Collection = Collection>(
  referencedCollection: RefC,
  field: keyof C["schema"]["schema"]
) {
  return new BelongsTo(referencedCollection, field as string);
}

type RelationSetupFn<
  C extends Collection = Collection,
  Config extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  hasMany: typeof hasMany;
  belongsTo: typeof belongsTo<C>;
}) => Config;

function relations<
  S extends Schema,
  CName extends string,
  C extends Collection = Collection<CName, S>,
  Config extends Record<string, Relation> = Record<string, Relation>
>(collection: C, setup: RelationSetupFn<C, Config>) {
  return new Relations<CName>(collection.dbName as CName, setup({ hasMany, belongsTo }));
}

interface CollectionRelationalConfig {
  dbName: string;
  tsName: string;
  relations: Record<string, Relation>;
  fields: Record<string, Field>;
  primaryKey: PrimaryKey;
}

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

type DatabaseRelationalConfig = Record<string, CollectionRelationalConfig>;

function extractDatabaseRelationalConfig<
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

class Database<
  DFullSchema extends Record<string, unknown>,
  DSchema extends DatabaseRelationalConfig
> {
  constructor(public fullSchema: DFullSchema, public schema: DSchema) {}
}

function database<S extends Record<string, unknown>>(schema: S) {
  const dbSchema =
    extractDatabaseRelationalConfig<ExtractDatabaseWithRelations<S>>(schema);
  return new Database(schema, dbSchema);
}

// --------

const users = collection("users", {
  id: string("id", ""),
});

const pets = collection("pets", {
  id: string("id", ""),
  user_id: string("id", ""),
});

const usersRelations = relations(users, ({ hasMany }) => ({
  pets: hasMany(pets, "user_id"),
}));

const petsRelations = relations(pets, ({ belongsTo }) => ({
  user: belongsTo(users, "user_id"),
}));

const db = database({
  users,
  pets,
  usersRelations,
  petsRelations,
});

test("test", () => {
  db.schema.users.relations
  expect(db.schema.pets.dbName).toBe("pets");
});
