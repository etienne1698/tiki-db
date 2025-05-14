import { Field } from "./field";

export class NumberField<DbName extends string = string> extends Field<number, DbName> {
  constructor(dbName: DbName, defaultValue: number | null) {
    super(dbName, defaultValue);
  }

  check(data: any): data is number {
    return typeof data === "number";
  }
}

export function number<DbName extends string = string>(dbName: DbName, defaultValue?: number | null) {
  return new NumberField(dbName, defaultValue || null);
}
