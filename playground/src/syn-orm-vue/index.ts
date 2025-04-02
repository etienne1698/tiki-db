import { ref, type Ref } from "vue";
import {
  type Query,
  Model,
  type InferModelNormalizedType,
  type Primary,
  type Datastore,
  Relation,
  createDatabase,
} from "../syn-orm";
import type { AnyButMaybeT, MaybeAsArray } from "../syn-orm/types";

export abstract class RefDatastore implements Datastore {
  abstract getStore<M extends Model = Model>(
    name: string
  ): Ref<Record<Primary, InferModelNormalizedType<M>>>;

  abstract load<M extends Model>(model: M): void;

  #loadRelated<M extends Model>(
    query: Query<M>,
    model: M,
    data: InferModelNormalizedType<M>[]
  ) {
    const modelRelations = model.relations();
    return data.map((data) => {
      const m = { ...data } as InferModelNormalizedType<M>;
      for (const relation of query.with.values()) {
        // @ts-ignore
        m[relation] = modelRelations[relation].getFor(model, data, this);
      }
      return m;
    });
  }

  #applyFilters<M extends Model>(
    query: Query<M>,
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
    query?: Query<M>
  ): InferModelNormalizedType<M>[] {
    if (!query) return Object.values(this.getStore<M>(model.name).value || []);
    let result = query.primaries.length
      ? (this.getByPrimaries(
          model,
          query.primaries
        ) as InferModelNormalizedType<M>[])
      : (Object.values(
          this.getStore<M>(model.name).value || []
        ) as InferModelNormalizedType<M>[]);
    result = this.#applyFilters(query, result);
    if (query.with.size > 0) {
      result = this.#loadRelated(
        query,
        model,
        result
      ) as InferModelNormalizedType<M>[];
    }
    return result as InferModelNormalizedType<M>[];
  }

  delete<M extends Model>(
    model: M,
    primary: Primary,
    _query?: Query<M>
  ): Partial<InferModelNormalizedType<M>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.getStore(model.name).value[primary];
    return undefined;
  }

  update<M extends Model>(
    _model: M,
    _primary: Primary,
    _data: AnyButMaybeT<InferModelNormalizedType<M>>,
    _query?: Query<M>
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
    if (Array.isArray(data)) {
      return data
        .map((d) => this.saveOne.bind(this)(model, d, saveRelations))
        .filter((m) => m != null);
    }
    const saveRes = this.saveOne(model, data, saveRelations);
    return saveRes ? [saveRes] : [];
  }

  saveOne<M extends Model>(
    model: M,
    data: AnyButMaybeT<InferModelNormalizedType<M>>,
    saveRelations?: boolean
  ): Partial<InferModelNormalizedType<M>> | undefined {
    if (saveRelations) this.saveRelations(model.relations(), data);

    const state = this.getStore<M>(model.name);

    const primary = model.primary(data);
    const oldValue = state.value[primary];
    if (oldValue) {
      state.value[primary] = Object.assign(
        oldValue,
        model.schema.normalize(data)
      );
      return state.value[primary];
    }
    const res = model.schema.normalize(data);
    state.value[primary] = res as InferModelNormalizedType<M>;
    return res as InferModelNormalizedType<M>;
  }

  saveRelations<R extends Record<string, Relation>>(
    relations: R,
    data: Record<string, any>
  ): void {
    for (const [key, value] of Object.entries(data)) {
      if (relations[key]) {
        this.save(relations[key].related, value, true);
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

export class VueDatastore extends RefDatastore {
  stores: Record<string, Ref<Record<Primary, any>>> = {};

  load<M extends Model>(model: M) {
    if (this.stores[model.name]) return;
    this.stores[model.name] = ref({});
  }

  getStore<M extends Model>(
    name: string
  ): Ref<Record<Primary, InferModelNormalizedType<M>>> {
    return this.stores[name] as Ref<
      Record<Primary, InferModelNormalizedType<M>>
    >;
  }
}

export function createVueDatabase<
  Models extends Record<string, Model> = Record<string, Model>
>(models: Models) {
  return createDatabase(models, new VueDatastore());
}
