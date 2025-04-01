import { ref, Ref } from "vue";
import {
  Database,
  MapModelOptions,
  MaybeAsArray,
  Model,
  ModelConstructor,
  Primary,
  Query,
} from "abstracdb";

export abstract class VueRefDatabase extends Database {
  abstract getStore<M extends Model>(entity: string): Ref<Record<Primary, M>>;

  #loadRelated<M extends Model>(
    query: Query,
    model: ModelConstructor<M>,
    data: M[]
  ) {
    const modelRelations = model.relations();
    return data.map((model) => {
      const m = model.$clone();
      for (const relation of query.with.values()) {
        m[relation] = modelRelations[relation].getFor(model, this);
      }
      return m;
    });
  }

  #applyFilters<M extends Model>(query: Query, data: M[]) {
    /* for (const filter of this.#fnFilters) {
        data = data.filter(filter);
      } */
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

  getByPrimaries<M extends Model>(
    model: ModelConstructor<M>,
    primaries: Primary[]
  ) {
    const state = this.getStore<M>(model.entity);
    return primaries.map((primary) => state.value[primary]);
  }

  getByPrimary<M extends Model>(model: ModelConstructor<M>, primary: Primary) {
    return this.getStore<M>(model.entity).value[primary];
  }

  get<M extends Model>(model: ModelConstructor<M>, query?: Query): M[] {
    if (!query)
      return Object.values(this.getStore<M>(model.entity).value || []);
    let result = query.primaries.length
      ? this.getByPrimaries(model, query.primaries)
      : Object.values(this.getStore<M>(model.entity).value || []);
    result = this.#applyFilters(query, result);
    if (query.with.size > 0) {
      result = this.#loadRelated(query, model, result);
    }

    return result;
  }

  delete<M extends Model>(
    model: ModelConstructor<M>,
    primary: Primary,
    query?: Query
  ): M | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.getStore(model.entity).value[primary];
    return undefined;
  }

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

  saveRelations<M extends Model>(
    model: ModelConstructor<M>,
    data: Record<string, any>
  ): void {
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

  saveOne<M extends Model>(
    model: ModelConstructor<M>,
    data: MapModelOptions<M>,
    saveRelations?: boolean
  ): M | undefined {
    if (saveRelations) this.saveRelations(model, data);

    const state = this.getStore<M>(model.entity);

    const primary = Model.primary(model.primaryKey, data);
    const oldValue = state.value[primary];
    if (oldValue) {
      state.value[primary] = oldValue.$merge(data);
      return state.value[primary];
    }
    const res = this.map(model, data);
    state.value[primary] = res;
    return res;
  }
}

export class VueDatabase extends VueRefDatabase {
  entities: Record<string, Ref<Record<Primary, Model>>> = {};

  load() {}

  getStore<M extends Model>(entity: string): Ref<Record<Primary, M>> {
    if (!this.entities[entity]) {
      this.entities[entity] = ref({});
    }
    return this.entities[entity] as Ref<Record<Primary, M>>;
  }
}
