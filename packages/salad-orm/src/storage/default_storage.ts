import { Collection } from "../collection/collection";
import { Database } from "../database/database";
import { Query } from "../query/query";
import { Relations } from "../relation/relation";
import {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { Storage } from "./storage";

export abstract class DefaultSyncStorage extends Storage<false> {
  abstract getStore<C extends Collection>(c: C): any;

  get<C extends Collection>(
    collection: C,
    query?: Query<C>
  ): InferModelNormalizedType<C["model"]>[] {
    if (!query) return Object.values(this.getStore<C>(collection) || []);
    let result = query.primaries.length
      ? (this.getByPrimaries(
          collection,
          query.primaries
        ) as InferModelNormalizedType<C["model"]>[])
      : (Object.values(
          this.getStore<C>(collection) || []
        ) as InferModelNormalizedType<C["model"]>[]);
    return result as InferModelNormalizedType<C["model"]>[];
  }

  remove<C extends Collection>(
    collection: C,
    primary: Primary,
    _query?: Query<C>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    const state = this.getStore(collection);
    state[primary] = undefined;

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
    shouldSaveRelations?: boolean
  ):
    | Partial<InferModelNormalizedType<C["model"]>>
    | Partial<InferModelNormalizedType<C["model"]>>[] {
    if (Array.isArray(data)) {
      return data
        .map((d) => this.saveOne(collection, d, shouldSaveRelations))
        .filter((m) => m != null);
    }
    const saveRes = this.saveOne(collection, data, shouldSaveRelations);
    return saveRes ? [saveRes] : [];
  }

  saveOne<C extends Collection>(
    collection: C,
    data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    shouldSaveRelations?: boolean
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    if (shouldSaveRelations) this.saveRelations(collection.relations, data);

    const state = this.getStore<C>(collection);

    const primary = collection.model.primary(data);
    const oldValue = state[primary];
    if (oldValue) {
      state[primary] = Object.assign(
        oldValue,
        collection.model.normalize(data)
      );
      return state[primary];
    }
    const res = collection.model.normalize(data);
    state[primary] = res as InferModelNormalizedType<C["model"]>;
    return res as InferModelNormalizedType<C["model"]>;
  }

  saveRelations<R extends Relations>(
    relations: R,
    data: Record<string, any>
  ): void {
    for (const [key, value] of Object.entries(data)) {
      const relation = relations.schema[key];
      if (relation) {
        this.save(
          this.database.mapCollectionDbNameCollection[relation.related.dbName],
          value,
          true
        );

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
    return this.getStore<C>(collection)[primary];
  }

  getByPrimaries<C extends Collection>(
    collection: C,
    primaries: Primary[]
  ): InferModelNormalizedType<C["model"]>[] {
    const state = this.getStore<C>(collection);
    return primaries.map((primary) => state[primary]);
  }
}
