import { ref, type Ref } from "vue";
import type { DatabaseStore } from "../syn-orm/database/database_store";
import type {
  Model,
  InferModelNormalizedType,
  Primary,
} from "../syn-orm/model";
import type { Query } from "../syn-orm/query/query";
import type { AnyButMaybeT, MaybeAsArray } from "../syn-orm/types";
/* 
export abstract class VueRefDatabase extends Database {
  abstract getStore<M extends Model>(name: string): Ref<Record<Primary, M>>;







  insert<M extends Model>(
    model: ModelConstructor<M>,
    data: MapModelOptions<M>
  ): M[] {
    throw new Error("Method not implemented.");
  }

  update<M extends Model>(
    model: ModelConstructor<M>,
    primary: Primary,
    data: MapModelOptions<M>,
    query?: Query
  ): M | undefined {
    throw new Error("Method not implemented.");
  }

  save<M extends Model>(
    model: ModelConstructor<M>,
    data: MaybeAsArray<MapModelOptions<M>>,
    saveRelations?: boolean
  ): M[] {
    if (Array.isArray(data)) {
      return data
        .map((d) => this.saveOne.bind(this)(model, d, saveRelations))
        .filter((m) => m != null);
    }
    const saveRes = this.saveOne(model, data, saveRelations);
    return saveRes ? [saveRes] : [];
  }

}

export class VueDatabase extends VueRefDatabase {
  entities: Record<string, Ref<Record<Primary, Model>>> = {};

  load() {}

  getStore<M extends Model>(name: string): Ref<Record<Primary, M>> {
    if (!this.entities[name]) {
      this.entities[name] = ref({});
    }
    return this.entities[name] as Ref<Record<Primary, M>>;
  }
} */

export abstract class VueDatabase implements DatabaseStore {
  abstract getStore<M extends Model = Model>(
    name: string
  ): Ref<Record<Primary, InferModelNormalizedType<M>>>;

  abstract load<M extends Model>(model: M): void;

  #loadRelated<M extends Model>(
    query: Query,
    model: M,
    data: InferModelNormalizedType<M>[]
  ) {
    const modelRelations = model.relations();
    return data.map<InferModelNormalizedType<M>>((model) => {
      const m = model.$clone();
      for (const relation of query.with.values()) {
        m[relation] = modelRelations[relation].getFor(model, this);
      }
      return m;
    });
  }

  #applyFilters<M extends Model>(
    query: Query,
    data: InferModelNormalizedType<M>[]
  ): InferModelNormalizedType<M>[] {
    for (const [key, value] of Object.entries(query.filters.$eq)) {
      // @ts-ignore
      data = data.filter((model) => model[key] == value);
    }
    for (const [key, value] of Object.entries(query.filters.$in)) {
      // @ts-ignore
      data = data.filter((model) => value.includes(model[key]));
    }
    for (const [key, value] of Object.entries(query.filters.$ne)) {
      // @ts-ignore
      data = data.filter((model) => model[key] != value);
    }
    return data;
  }

  get<M extends Model>(
    model: Model,
    query?: Query
  ): InferModelNormalizedType<M>[] {
    if (!query) return Object.values(this.getStore<M>(model.name).value || []);
    let result = query.primaries.length
      ? this.getByPrimaries(model, query.primaries)
      : Object.values(this.getStore<M>(model.name).value || []);
    result = this.#applyFilters(query, result);
    if (query.with.size > 0) {
      result = this.#loadRelated(query, model, result);
    }
    return result as InferModelNormalizedType<M>[];
  }

  delete<M extends Model>(
    model: M,
    primary: Primary,
    _query?: Query
  ): Partial<InferModelNormalizedType<M>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.getStore(model.name).value[primary];
    return undefined;
  }

  update<M extends Model>(
    _model: M,
    _primary: Primary,
    _data: AnyButMaybeT<InferModelNormalizedType<M>>,
    _query?: Query
  ): Partial<InferModelNormalizedType<M>> | undefined {
    throw new Error("Method not implemented.");
  }

  insert<M extends Model>(
    _model: M,
    _data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<M>>>
  ): Partial<InferModelNormalizedType<M>>[] {
    throw new Error("Method not implemented.");
  }

  save<M extends Model>(
    model: M,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<M>>>,
    saveRelations?: boolean
  ):
    | Partial<InferModelNormalizedType<M>>
    | Partial<InferModelNormalizedType<M>>[] {
    throw new Error("Method not implemented.");
  }

  saveOne<M extends Model>(
    model: M,
    data: AnyButMaybeT<InferModelNormalizedType<M>>,
    saveRelations?: boolean
  ): Partial<InferModelNormalizedType<M>> | undefined {
    if (saveRelations) this.saveRelations(model, data);

    const state = this.getStore<M>(model.name);

    const primary = model.primary(data);
    const oldValue = state.value[primary];
    if (oldValue) {
      state.value[primary] = oldValue.$merge(data);
      return state.value[primary];
    }
    const res = model.schema.normalize(data);
    state.value[primary] = res;
    return res;
  }

  saveRelations<M extends Model>(model: M, data: Record<string, any>): void {
     const modelRelations = model.relations();
    for (const [key, value] of Object.entries(data)) {
      if (modelRelations[key]) {
        this.save(modelRelations[key].related, value, true);
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[key];
      }
    }
  }

  getByPrimary<M extends Model>(
    model: M,
    primary: Primary
  ): InferModelNormalizedType<M> | undefined {
    return this.getStore<M>(model.name).value[primary];
  }

  getByPrimaries<M extends Model>(
    model: M,
    primaries: Primary[]
  ): InferModelNormalizedType<M>[] {
    const state = this.getStore<M>(model.name);
    return primaries.map((primary) => state.value[primary]);
  }
}
