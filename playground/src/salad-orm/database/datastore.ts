import type { Query } from "../query/query";
import type { Relation } from "../relations/relations";
import type {
  AnyButMaybeT,
  Document,
  MaybeAsArray,
  Primary,
  CollectionFullSchema,
} from "../types";

export interface Datastore {
  get<TCollection extends CollectionFullSchema>(
    model: TCollection,
    query?: Query<TCollection>
  ): Document<TCollection>[];

  load<TCollection extends CollectionFullSchema>(model: TCollection): void;

  delete<TCollection extends CollectionFullSchema>(
    model: TCollection,
    primary: Primary,
    query?: Query<TCollection>
  ): Partial<Document<TCollection>> | undefined;

  update<TCollection extends CollectionFullSchema>(
    model: TCollection,
    primary: Primary,
    data: AnyButMaybeT<Document<TCollection>>,
    query?: Query<TCollection>
  ): Partial<Document<TCollection>> | undefined;

  insert<TCollection extends CollectionFullSchema>(
    model: TCollection,
    data: MaybeAsArray<AnyButMaybeT<Document<TCollection>>>
  ): Partial<Document<TCollection>>[];

  save<TCollection extends CollectionFullSchema>(
    model: TCollection,
    data: MaybeAsArray<AnyButMaybeT<Document<TCollection>>>,
    saveRelations?: boolean
  ): Partial<Document<TCollection>> | Partial<Document<TCollection>>[];

  saveOne<TCollection extends CollectionFullSchema>(
    model: TCollection,
    data: AnyButMaybeT<Document<TCollection>>,
    saveRelations?: boolean
  ): Partial<Document<TCollection>> | undefined;

  saveRelations<R extends Record<string, Relation>>(
    relations: R,
    data: Record<string, any>
  ): void;

  getByPrimary<TCollection extends CollectionFullSchema>(
    model: TCollection,
    primary: Primary
  ): Document<TCollection> | undefined;

  getByPrimaries<TCollection extends CollectionFullSchema>(
    model: TCollection,
    primaries: Primary[]
  ): Document<TCollection>[];
}
