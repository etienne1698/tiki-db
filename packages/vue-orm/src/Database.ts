import { ref, type Ref } from "vue";
import { QueryBuilder } from "./QueryBuilder";
import { Model } from "./Model";
import { ModelConstructor } from "./types";
import { QueryType } from "./Query";

export abstract class Database {
  abstract getStore<T>(entity: string): Ref<{ [key: string]: T }>;

  query<M extends Model>(model: ModelConstructor<M>): QueryBuilder<M> {
    return new QueryBuilder<M>(this, model, QueryType.get);
  }
}

export class VueDatabase extends Database {
  entities: Record<string, Ref> = {};

  getStore(entity: string): Ref {
    if (!this.entities[entity]) {
      this.entities[entity] = ref({});
    }
    return this.entities[entity];
  }
}
