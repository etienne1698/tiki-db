import type { Ref } from "vue";
import type Model from "./Model";

type EntityName = string;
type PrimaryKey = string;

export default class Database {
  state: Ref<Record<EntityName, Record<PrimaryKey, Model>>>;

  constructor(state: Ref) {
    this.state = state;
  }

  insert(m: Model) {
    this.state.value[""] = {
      [m.$primaryKey()]: m,
    };
  }
}
