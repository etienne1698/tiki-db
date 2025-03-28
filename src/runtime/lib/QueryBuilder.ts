import { computed, type Ref } from "vue";
import type Model from "./Model";
import type { PrimaryKey } from "./types";

export default class QueryBuilder<M extends Model> {
  private declare state: Ref<Record<PrimaryKey, M>>;

  constructor(state: Ref<Record<PrimaryKey, M>>) {
    this.state = state;
  }

  with(...relations: string[]) {
    console.error(relations);
    return this;
  }

  get() {
    return computed(() => {
      return Object.values(this.state.value || []);
    });
  }
}
