import { Field } from "./field";

export class StringField extends Field<string> {
  constructor(name: string, defaultValue: string | null) {
    super(name, defaultValue);
  }

  check(data: any): data is string {
    return typeof data === "string";
  }
}

export function string(name: string, defaultValue: string) {
  return new StringField(name, defaultValue);
}
