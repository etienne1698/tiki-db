import { ref, type Ref } from "vue";
import { QueryBuilder } from "./QueryBuilder";
import { Model } from "./Model";
import { ModelConstructor } from "./types";
import { Query, QueryType } from "./Query";
import { QueryInterpreter } from "./QueryInterpreter";

export abstract class Database {
  abstract getStore<T>(entity: string): Ref<{ [key: string]: T }>;

  middlewares: QueryInterpreter[] = [];

  query<M extends Model>(model: ModelConstructor<M>): QueryBuilder<M> {
    return new QueryBuilder<M>(this, model, QueryType.get);
  }

  exec<T>(query: Query): T {
    let index = 0;

    const next = <T>(): T => {
      if (index > this.middlewares.length) throw new Error("No result from QueryInterpreter's");

      const middleware = this.middlewares[index++];
      return middleware({ next, query });
    };

    return next<T>();
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
