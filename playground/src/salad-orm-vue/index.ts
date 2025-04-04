import { ref, type Ref } from "vue";
import {
  type Query,
  type InferModelNormalizedType,
  type Primary,
  Storage,
  Relations,
  Collection,
} from "../salad-orm";
import type { AnyButMaybeT, MaybeAsArray } from "../salad-orm/types";

export abstract class RefStorage extends Storage {
  abstract getStore<C extends Collection = Collection>(
    collection: C
  ): Ref<Record<Primary, InferModelNormalizedType<C["model"]>>>;

  abstract load<C extends Collection>(collection: C): boolean;

  #loadRelated<C extends Collection>(
    query: Query<C>,
    collection: C,
    data: InferModelNormalizedType<C["model"]>[]
  ) {
    return data.map((data) => {
      const m = { ...data } as InferModelNormalizedType<C["model"]>;
      for (const relation of query.with.values()) {
        // @ts-ignore
        m[relation] = collection.relations.schema[relation].getFor(
          collection.model,
          data
        );
      }
      return m;
    });
  }

  #applyFilters<C extends Collection>(
    query: Query<C>,
    data: InferModelNormalizedType<C["model"]>[]
  ): InferModelNormalizedType<C["model"]>[] {
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

  get<C extends Collection>(
    collection: C,
    query?: Query<C>
  ): InferModelNormalizedType<C["model"]>[] {
    if (!query) return Object.values(this.getStore<C>(collection).value || []);
    let result = query.primaries.length
      ? (this.getByPrimaries(
          collection,
          query.primaries
        ) as InferModelNormalizedType<C["model"]>[])
      : (Object.values(
          this.getStore<C>(collection).value || []
        ) as InferModelNormalizedType<C["model"]>[]);
    result = this.#applyFilters(query, result);
    if (query.with.size > 0) {
      result = this.#loadRelated(
        query,
        collection,
        result
      ) as InferModelNormalizedType<C["model"]>[];
    }
    return result as InferModelNormalizedType<C["model"]>[];
  }

  delete<C extends Collection>(
    collection: C,
    primary: Primary,
    _query?: Query<C>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.getStore(collection).value[primary];
    return undefined;
  }

  update<C extends Collection>(
    _collection: C,
    _primary: Primary,
    _data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    _query?: Query<C>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    throw new Error("Method not implemented.");
  }

  insert<C extends Collection>(
    _collection: C,
    _data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): Partial<InferModelNormalizedType<C["model"]>>[] {
    throw new Error("Method not implemented.");
  }

  save<C extends Collection>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
    saveRelations?: boolean
  ):
    | Partial<InferModelNormalizedType<C["model"]>>
    | Partial<InferModelNormalizedType<C["model"]>>[] {
    if (Array.isArray(data)) {
      return data
        .map((d) => this.saveOne.bind(this)(collection, d, saveRelations))
        .filter((m) => m != null);
    }
    const saveRes = this.saveOne(collection, data, saveRelations);
    return saveRes ? [saveRes] : [];
  }

  saveOne<C extends Collection>(
    collection: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    saveRelations?: boolean
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    if (saveRelations) this.saveRelations(collection.relations, data);

    const state = this.getStore<C>(collection);

    const primary = collection.model.primary(data);
    const oldValue = state.value[primary];
    if (oldValue) {
      state.value[primary] = Object.assign(
        oldValue,
        collection.model.normalize(data)
      );
      return state.value[primary];
    }
    const res = collection.model.normalize(data);
    state.value[primary] = res as InferModelNormalizedType<C["model"]>;
    return res as InferModelNormalizedType<C["model"]>;
  }

  saveRelations<R extends Relations>(
    relations: R,
    data: Record<string, any>
  ): void {
    for (const [key, value] of Object.entries(data)) {
      if (relations.schema[key]) {
        // this.save(relations.schema[key].related, value, true);

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[key];
      }
    }
  }

  getByPrimary<C extends Collection>(
    collection: C,
    primary: Primary
  ): InferModelNormalizedType<C["model"]> | undefined {
    return this.getStore<C>(collection).value[primary];
  }

  getByPrimaries<C extends Collection>(
    collection: C,
    primaries: Primary[]
  ): InferModelNormalizedType<C["model"]>[] {
    const state = this.getStore<C>(collection);
    return primaries.map((primary) => state.value[primary]);
  }
}

export class VueStorage extends RefStorage {
  stores: Record<string, Ref<Record<Primary, any>>> = {};

  load<C extends Collection>(collection: C) {
    if (this.stores[collection.model.dbName]) return true;
    this.stores[collection.model.dbName] = ref({});
    return true;
  }

  getStore<C extends Collection>(
    collection: C
  ): Ref<Record<Primary, InferModelNormalizedType<C["model"]>>> {
    return this.stores[collection.model.dbName] as Ref<
      Record<Primary, InferModelNormalizedType<C["model"]>>
    >;
  }
}
