import type { Field } from "../schema/field";

export class Collection<
  TCollectionName extends string = string,
  TSchema extends Record<string, Field> = Record<string, Field>
> {
  constructor(public dbName: TCollectionName, public schema: TSchema) {}

  normalize(data: any) {
    const normalizedData: { [K in keyof TSchema]: TSchema[K]["defaultValue"] } = {} as {
      [K in keyof TSchema]: TSchema[K]["defaultValue"];
    };
    for (const key in this.schema) {
      const field = this.schema[key];
      normalizedData[key] = field.normalize(data[key]);
    }
    return normalizedData;
  }
}

export function collection<
  TCollectionName extends string,
  TSchema extends Record<string, Field> = Record<string, Field>
>(collectionName: TCollectionName, schema: TSchema) {
  return new Collection(collectionName, schema);
}
