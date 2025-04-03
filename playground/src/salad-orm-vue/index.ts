import type { Ref } from "vue";
import {
  type Datastore,
  type CollectionFullSchema,
  type Document,
  type Primary,
  type Query,
  type AnyButMaybeT,
  type MaybeAsArray,
  Relation,
} from "../salad-orm";

export abstract class RefDatastore implements Datastore {
  abstract getStore<TCollection extends CollectionFullSchema = CollectionFullSchema>(
    name: string
  ): Ref<Record<Primary, Document<TCollection>>>;

  abstract load<TCollection extends CollectionFullSchema>(collection: TCollection): void;

  #loadRelated<TCollection extends CollectionFullSchema>(
    query: Query<TCollection>,
    collection: TCollection,
    data: Document<TCollection>[]
  ) {
    const collectionRelations = collection.relations;
    return data.map((data) => {
      const m = { ...data } as Document<TCollection>;
      for (const relation of query.with.values()) {
        // @ts-ignore
        m[relation] = collectionRelations[relation].getFor(collection, data, this);
      }
      return m;
    });
  }

  #applyFilters<TCollection extends CollectionFullSchema>(
    query: Query<TCollection>,
    data: Document<TCollection>[]
  ): Document<TCollection>[] {
    for (const [key, value] of Object.entries(query.filters.$eq)) {
      // @ts-ignore
      data = data.filter((collection) => collection[key] == value);
    }
    for (const [key, value] of Object.entries(query.filters.$in)) {
      // @ts-ignore
      data = data.filter((collection) => value.includes(collection[key]));
    }
    for (const [key, value] of Object.entries(query.filters.$ne)) {
      // @ts-ignore
      data = data.filter((collection) => collection[key] != value);
    }
    return data;
  }

  get<TCollection extends CollectionFullSchema>(
    collection: CollectionFullSchema,
    query?: Query<TCollection>
  ): Document<TCollection>[] {
    if (!query) return Object.values(this.getStore<TCollection>(collection.dbName).value || []);
    let result = query.primaries.length
      ? (this.getByPrimaries(collection, query.primaries) as Document<TCollection>[])
      : (Object.values(
          this.getStore<TCollection>(collection.dbName).value || []
        ) as Document<TCollection>[]);
    result = this.#applyFilters(query, result);
    if (query.with.size > 0) {
      result = this.#loadRelated(query, collection, result) as Document<TCollection>[];
    }
    return result as Document<TCollection>[];
  }

  delete<TCollection extends CollectionFullSchema>(
    collection: TCollection,
    primary: Primary,
    _query?: Query<TCollection>
  ): Partial<Document<TCollection>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.getStore(collection.dbName).value[primary];
    return undefined;
  }

  update<TCollection extends CollectionFullSchema>(
    _collection: TCollection,
    _primary: Primary,
    _data: AnyButMaybeT<Document<TCollection>>,
    _query?: Query<TCollection>
  ): Partial<Document<TCollection>> | undefined {
    throw new Error("Method not implemented.");
  }

  insert<TCollection extends CollectionFullSchema>(
    _collection: TCollection,
    _data: MaybeAsArray<AnyButMaybeT<Document<TCollection>>>
  ): Partial<Document<TCollection>>[] {
    throw new Error("Method not implemented.");
  }

  save<TCollection extends CollectionFullSchema>(
    collection: TCollection,
    data: MaybeAsArray<AnyButMaybeT<Document<TCollection>>>,
    saveRelations?: boolean
  ): Partial<Document<TCollection>> | Partial<Document<TCollection>>[] {
    if (Array.isArray(data)) {
      return data
        .map((d) => this.saveOne.bind(this)(collection, d, saveRelations))
        .filter((m) => m != null);
    }
    const saveRes = this.saveOne(collection, data, saveRelations);
    return saveRes ? [saveRes] : [];
  }

  saveOne<TCollection extends CollectionFullSchema>(
    collection: TCollection,
    data: AnyButMaybeT<Document<TCollection>>,
    saveRelations?: boolean
  ): Partial<Document<TCollection>> | undefined {
    if (saveRelations) this.saveRelations(collection.relations, data);

    const state = this.getStore<TCollection>(collection.dbName);

    const primary = collection.primary(data);
    const oldValue = state.value[primary];
    if (oldValue) {
      state.value[primary] = Object.assign(
        oldValue,
        collection.schema.normalize(data)
      );
      return state.value[primary];
    }
    const res = collection.schema.normalize(data);
    state.value[primary] = res as Document<TCollection>;
    return res as Document<TCollection>;
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

  getByPrimary<TCollection extends CollectionFullSchema>(
    collection: TCollection,
    primary: Primary
  ): Document<TCollection> | undefined {
    return this.getStore<TCollection>(collection.dbName).value[primary];
  }

  getByPrimaries<TCollection extends CollectionFullSchema>(
    collection: TCollection,
    primaries: Primary[]
  ): Document<TCollection>[] {
    const state = this.getStore<TCollection>(collection.dbName);
    return primaries.map((primary) => state.value[primary]);
  }
}

function createVueDatastore() {}
