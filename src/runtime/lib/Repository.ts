import type { Ref } from "vue";
import Model from "./Model";
import type { Constructor, PrimaryKey } from "./types";
import QueryBuilder from "./QueryBuilder";

export default class Repository<M extends Model = Model> {
  use!: Constructor<M>;
  state!: Ref<Record<PrimaryKey, M>>;

  init() {
    if (
      Object.values(this.state.value) &&
      !(Object.values(this.state.value)[0] instanceof Model)
    ) {
      for (const key of Object.keys(this.state.value)) {
        this.state.value[key] = this.map(this.state.value[key]);
      }
    }
  }

  map(data: Partial<M & Record<string, any>>) {
    return Object.assign(new this.use(), data);
  }

  save(data: Partial<M & Record<string, any>>) {
    const res = this.map(data);
    const identifier = res.$primaryKey();
    this.state.value[identifier] = res;
    return res;
  }

  all() {
    return new QueryBuilder(this.state).get();
  }

  with(...relations: string[]) {
    return new QueryBuilder(this.state).with(...relations);
  }
}
