import { Field } from "./field";

export class StringField<DbName extends string = string> extends Field<string, DbName> {
  constructor(dbName: DbName, defaultValue: string | null) {
    super(dbName, defaultValue);
  }

  check(data: any): data is string {
    return typeof data === "string";
  }
}

export function string<DbName extends string = string>(dbName: DbName, defaultValue?: string | null) {
  return new StringField(dbName, defaultValue || null);
}
