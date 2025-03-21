import type Model from "./Model";
import type { Constructor } from "./types";
import type Database from "./Database";

export default class Repository<M extends Model = Model> {
  use!: Constructor<M>;
  database!: Database;

  map(data: Partial<M & Record<string, any>>): M {
    console.error(data);
    const result = new this.use();
    Object.assign(result, data);
    return result;
  }

  save(data: Partial<M & Record<string, any>>) {
    const record = this.map(data);
    record.$primaryKey();
  }
}
