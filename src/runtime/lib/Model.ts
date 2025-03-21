export default abstract class Model {
  static primaryKey: string | string[];

  $primaryKey(): string {
    // @ts-ignore
    if (typeof this.primaryKey === "string") {
      // @ts-ignore
      return this[this.primaryKey];
    }
    // @ts-ignore
    return this.primaryKey.map((k) => this[k]).join();
  }
}
