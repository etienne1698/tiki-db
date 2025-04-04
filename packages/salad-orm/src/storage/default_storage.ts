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

/**
 *
 * This function creates a default storage that acts as if "getStore" returns a
 * simple object. It works as an abstraction layer for simple inmemory storages.
 *
 **/
export const createDefaultStorage = <D extends Database>(
  name: string,
  load: ReturnType<Storage<D>>["load"],
  getStore: <C extends Collection>(collection: C) => any
): Storage<D> => {
  return (database: D) => {
    function get<C extends Collection>(
      collection: C,
      query?: Query<C>
    ): InferModelNormalizedType<C["model"]>[] {
      if (!query) return Object.values(getStore<C>(collection) || []);
      let result = query.primaries.length
        ? (getByPrimaries(
            collection,
            query.primaries
          ) as InferModelNormalizedType<C["model"]>[])
        : (Object.values(
            getStore<C>(collection) || []
          ) as InferModelNormalizedType<C["model"]>[]);
      return result as InferModelNormalizedType<C["model"]>[];
    }

    function remove<C extends Collection>(
      collection: C,
      primary: Primary,
      _query?: Query<C>
    ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      const state = getStore(collection);
      state[primary] = undefined;

      return undefined;
    }

    function update<C extends Collection>(
      _collection: C,
      _primary: Primary,
      _data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
      _query?: Query<C>
    ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
      throw new Error("Method not implemented.");
    }

    function insert<C extends Collection>(
      _collection: C,
      _data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
    ): Partial<InferModelNormalizedType<C["model"]>>[] {
      throw new Error("Method not implemented.");
    }

    function save<C extends Collection>(
      collection: C,
      data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>,
      shouldSaveRelations?: boolean
    ):
      | Partial<InferModelNormalizedType<C["model"]>>
      | Partial<InferModelNormalizedType<C["model"]>>[] {
      if (Array.isArray(data)) {
        return data
          .map((d) => saveOne(collection, d, shouldSaveRelations))
          .filter((m) => m != null);
      }
      const saveRes = saveOne(collection, data, shouldSaveRelations);
      return saveRes ? [saveRes] : [];
    }

    function saveOne<C extends Collection>(
      collection: C,
      data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
      shouldSaveRelations?: boolean
    ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
      if (shouldSaveRelations) saveRelations(collection.relations, data);

      const state = getStore<C>(collection);

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
      console.error(getStore<C>(collection)[primary]);
      return res as InferModelNormalizedType<C["model"]>;
    }

    function saveRelations<R extends Relations>(
      relations: R,
      data: Record<string, any>
    ): void {
      for (const [key, value] of Object.entries(data)) {
        const relation = relations.schema[key];
        if (relation) {
          save(database.dbMapCollection[relation.related.dbName], value, true);

          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete data[key];
        }
      }
    }

    function getByPrimary<C extends Collection>(
      collection: C,
      primary: Primary
    ): InferModelNormalizedType<C["model"]> | undefined {
      return getStore<C>(collection)[primary];
    }

    function getByPrimaries<C extends Collection>(
      collection: C,
      primaries: Primary[]
    ): InferModelNormalizedType<C["model"]>[] {
      const state = getStore<C>(collection);
      return primaries.map((primary) => state[primary]);
    }

    return {
      name,
      get,
      remove,
      update,
      insert,
      save,
      saveOne,
      saveRelations,
      getByPrimary,
      getByPrimaries,
      load,
    };
  };
};
