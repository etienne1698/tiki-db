import type { Collection } from "../collections/collections";
import type { Schema } from "../schema/schema";

export type RelationSetupFn<
  C extends Collection = Collection,
  Config extends Record<string, Relation> = Record<string, Relation>
> = (relations: {
  hasMany: typeof hasMany;
  belongsTo: typeof belongsTo<C>;
}) => Config;

export function relations<
  S extends Schema,
  CName extends string,
  C extends Collection = Collection<CName, S>,
  Config extends Record<string, Relation> = Record<string, Relation>
>(collection: C, setup: RelationSetupFn<C, Config>) {
  return new Relations<CName>(
    collection.dbName as CName,
    setup({ hasMany, belongsTo })
  );
}

export function hasMany<RefC extends Collection>(
  referencedCollection: RefC,
  field: keyof RefC["schema"]["schema"]
) {
  return new HasMany(referencedCollection, field as string);
}
export function belongsTo<C extends Collection, RefC extends Collection = Collection>(
  referencedCollection: RefC,
  field: keyof C["schema"]["schema"]
) {
  return new BelongsTo(referencedCollection, field as string);
}

export class Relation<RefCName extends string = string> {
  declare referencedCollectionName: RefCName;

  constructor(
    referencedCollection: Collection<RefCName>,
    public field: string
  ) {
    this.referencedCollectionName = referencedCollection.dbName;
  }
}

export class HasMany<RefCName extends string = string> extends Relation<RefCName> {}

export class BelongsTo<RefCName extends string = string> extends Relation<RefCName> {}

export class Relations<
  CollectionName extends string,
  Config extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public collectionName: CollectionName, public config: Config) {}
}
