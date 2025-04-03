import type { Field } from "./schema/field";
import { Schema } from "./schema/schema";
import { string } from "./schema/string";

class Collection<
  CollectionName extends string = string,
  S extends Schema = Schema
> {
  constructor(public collectionName: CollectionName, public schema: S) {}
}

class Relation<CollectionName extends string = string> {
  constructor(public referenceModelName: string, public field: string) {}
}

class Relations<
  CollectionName extends string = string,
  Config extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public collectionName: CollectionName, public config: Config) {}
}

function collection<
  CollectionName extends string = string,
  S extends Record<string, Field> = Record<string, Field>
>(collectionName: CollectionName, schema: S) {
  return new Collection(collectionName, new Schema(schema));
}

// --------

const user = collection("users", {
  id: string("id", ""),
});
