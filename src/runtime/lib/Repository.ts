import { computed, type Ref } from "vue";
import type Model from "./Model";
import type { Constructor } from "./types";

type PrimaryKey = string;

export default class Repository<M extends Model = Model> {
  use!: Constructor<M>;
  state!: Ref<Record<PrimaryKey, M>>;

  save(data: Partial<M & Record<string, any>>) {
    const res = Object.assign(new this.use(), data);
    const identifier = res.$primaryKey();
    this.state.value[identifier] = res;
    return res;
  }

  all() {
    return computed(() =>
      this.state.value ? Object.values(this.state.value) : []
    );
  }
}
