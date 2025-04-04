import type { Collection } from "../collections/collections";

export class Relation<TRefCollectionName extends string = string> {
  declare referencedCollectionName: TRefCollectionName;

  constructor(
    referencedCollection: Collection<TRefCollectionName>,
    public field: string
  ) {
    this.referencedCollectionName = referencedCollection.dbName;
  }
}

export class Relations<
  TCollectionName extends string,
  TConfig extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public collectionName: TCollectionName, public config: TConfig) {}
}

export class HasMany<
  TRefCollectionName extends string = string
> extends Relation<TRefCollectionName> {}

export class BelongsTo<
  TRefCollectionName extends string = string
> extends Relation<TRefCollectionName> {}

export type RelationSetupFn<
  TCollection extends Collection = Collection,
  Config extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  hasMany: typeof hasMany;
  belongsTo: typeof belongsTo<TCollection>;
}) => Config;

export function relations<
  TCollectionName extends string,
  TCollection extends Collection<TCollectionName>,
  TConfig extends Record<string, Relation> = Record<string, Relation>
>(collection: TCollection, setup: RelationSetupFn<TCollection, TConfig>) {
  return new Relations<(typeof collection)["dbName"], TConfig>(
    collection.dbName,
    setup({ hasMany, belongsTo })
  );
}

export function hasMany<TRefCollection extends Collection>(
  referencedCollection: TRefCollection,
  field: keyof TRefCollection["schema"]
) {
  return new HasMany(referencedCollection, field as string);
}
export function belongsTo<
  TCollection extends Collection,
  TRefCollection extends Collection = Collection
>(referencedCollection: TRefCollection, field: keyof TCollection["schema"]) {
  return new BelongsTo(referencedCollection, field as string);
}
