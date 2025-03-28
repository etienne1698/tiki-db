import type { Relation } from "./Relation";

export default abstract class Model {
  static primaryKey: string | string[] = "id";

  $primaryKey(): string {
    // @ts-ignore
    const primaryKey: string | string[] = this.primaryKey || Model.primaryKey;
    if (typeof primaryKey === "string") {
      // @ts-ignore
      return this[primaryKey];
    }
    // @ts-ignore
    return primaryKey.map((k) => this[k]).join();
  }

  relations(): { [key: string]: Relation } {
    return {};
  }

  toJSON() {
    return this;
  }
}
