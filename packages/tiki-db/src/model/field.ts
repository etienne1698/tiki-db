export abstract class Field<
  T = unknown,
  DbName extends string = string,
  Default extends T | null | undefined = T | null | undefined,
  
> {
  isNullable: boolean = true;

  constructor(public dbName: DbName, public defaultValue: Default) {}

  protected abstract check(data: any): data is T;

  notNull() {
    this.isNullable = false;
    return this as Field<T, DbName, T>;
  }

  normalize(data: any): Default {
    if ((this.isNullable && data == null) || this.check(data)) return data;
    return this.defaultValue;
  }
}
