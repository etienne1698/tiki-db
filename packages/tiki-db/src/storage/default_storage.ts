import { CollectionSchema } from "../collection/collection_schema";
import { Database } from "../database/database";
import { Query, QueryResult } from "../query/query";
import { Relation, Relations } from "../relation/relation";
import {
  AnyButMaybeT,
  InferModelNormalizedType,
  MaybeAsArray,
  Primary,
} from "../types";
import { Storage } from "./storage";

export abstract class DefaultStorage implements Storage<false> {
  constructor(public database: Database) {}

  abstract getStore<C extends CollectionSchema>(c: C): any;
  abstract load<C extends CollectionSchema>(collection: C): boolean;

  #loadRelations<C extends CollectionSchema, D extends Database>(
    collection: C,
    data: InferModelNormalizedType<C["model"]>[],
    query?: Query<C, D>
  ) {
    if (!query?.with) return data;
    const relations = Object.keys(query.with).filter(
      (k) => query.with[k] === true
    );

    return data.map((d) => {
      for (const relation of relations) {
        const relatedCollection =
          this.database.mapCollectionDbNameCollection[
            collection.relations.schema[relation].related.dbName
          ];
        d[relation] = this.get(
          this.database.mapCollectionDbNameCollection[
            collection.relations.schema[relation].related.dbName
          ],
          collection.relations.schema[relation].queryFor(d, this.database).query
        );
        if (!collection.relations.schema[relation].multiple) {
          d[relation] = d[relation]?.[0];
        }
      }
      return d;
    });
  }

  get<C extends CollectionSchema, D extends Database, Q extends Query<C, D>>(
    collection: C,
    query?: Q
  ): QueryResult<C, D, Q> {
    if (!query) return Object.values(this.getStore<C>(collection) || []);
    let result = query.primaries.length
      ? (this.getByPrimaries(
          collection,
          query.primaries
        ) as InferModelNormalizedType<C["model"]>[])
      : (Object.values(
          this.getStore<C>(collection) || []
        ) as InferModelNormalizedType<C["model"]>[]);

    result = this.#loadRelations(collection, result, query);
    return result as QueryResult<C, D, Q>;
  }

  remove<C extends CollectionSchema, D extends Database>(
    collection: C,
    primary: Primary,
    _query?: Query<C, D>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    const state = this.getStore(collection);
    state[primary] = undefined;

    return undefined;
  }

  update<C extends CollectionSchema, D extends Database>(
    _collection: C,
    _primary: Primary,
    _data: AnyButMaybeT<InferModelNormalizedType<C["model"]>>,
    _query?: Query<C, D>
  ): Partial<InferModelNormalizedType<C["model"]>> | undefined {
    throw new Error("Method not implemented.");
  }

  insert<C extends CollectionSchema, D extends Database>(
    _collection: C,
    _data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<C["model"]>>>
  ): Partial<InferModelNormalizedType<C["model"]>>[] {
    throw new Error("Method not implemented.");
  }

  save<C extends CollectionSchema, D extends Database>(
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

  saveOne<C extends CollectionSchema, D extends Database>(
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

  saveRelations<R extends Relations, D extends Database>(
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

  getByPrimary<C extends CollectionSchema, D extends Database>(
    collection: C,
    primary: Primary
  ): InferModelNormalizedType<C["model"]> | undefined {
    return this.getStore<C>(collection)[primary];
  }

  getByPrimaries<C extends CollectionSchema, D extends Database>(
    collection: C,
    primaries: Primary[]
  ): InferModelNormalizedType<C["model"]>[] {
    const state = this.getStore<C>(collection);
    return primaries.map((primary) => state[primary]);
  }
}
