import type { Field } from "../schema/field";
import { Schema } from "../schema/schema";

export class Collection<
  CollectionName extends string = string,
  S extends Schema = Schema
> {
  constructor(public dbName: CollectionName, public schema: S) {}
}

export function collection<
  CollectionName extends string,
  S extends Record<string, Field> = Record<string, Field>
>(collectionName: CollectionName, schema: S) {
  return new Collection<CollectionName>(collectionName, new Schema<S>(schema));
}
