import { Field } from "./field";

export class StringField extends Field<string> {
  constructor(dbName: string, defaultValue: string | null) {
    super(dbName, defaultValue);
  }

  check(data: any): data is string {
    return typeof data === "string";
  }
}

export function string(dbName: string, defaultValue?: string | null) {
  return new StringField(dbName, defaultValue || null);
}
