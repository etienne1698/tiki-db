import type { Field } from "../schema/field";

export class Collection<
  CollectionName extends string = string,
  S extends Record<string, Field> = Record<string, Field>
> {
  constructor(public dbName: CollectionName, public schema: S) {}

  normalize(data: any) {
    const normalizedData: { [K in keyof S]: S[K]["defaultValue"] } = {} as {
      [K in keyof S]: S[K]["defaultValue"];
    };
    for (const key in this.schema) {
      const field = this.schema[key];
      normalizedData[key] = field.normalize(data[key]);
    }
    return normalizedData;
  }
}

export function collection<
  CollectionName extends string,
  S extends Record<string, Field> = Record<string, Field>
>(collectionName: CollectionName, schema: S) {
  return new Collection(collectionName, schema);
}
