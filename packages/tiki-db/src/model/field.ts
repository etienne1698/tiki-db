export abstract class Field<T = unknown, Default extends T | null = T | null> {
  isNullable: boolean = true;

  constructor(public dbName: string, public defaultValue: Default) {}

  protected abstract check(data: any): data is T;

  notNull() {
    this.isNullable = false;
    return this as Field<T, T>;
  }

  normalize(data: any): Default {
    if ((this.isNullable && data == null) || this.check(data)) return data;
    return this.defaultValue;
  }
}
