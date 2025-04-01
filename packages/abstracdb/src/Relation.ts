import type { Database } from "./Database";
import type { Model } from "./Model";
import type { ModelConstructor } from "./types";

export abstract class Relation<M extends Model = Model> {
  declare related: ModelConstructor<M>;
  declare field: string;

  constructor(related: ModelConstructor<M>, field: string) {
    this.related = related;
    this.field = field;
  }

  abstract getFor<T extends Model>(model: T, database: Database): M | M[];

  static hasMany<M extends Model>(model: ModelConstructor<M>, field: string) {
    return new HasManyRelation(model, field);
  }

  static belongsTo<M extends Model>(model: ModelConstructor<M>, field: string) {
    return new BelongsToRelation(model, field);
  }

  static hasOne<M extends Model>(model: ModelConstructor<M>, field: string) {
    return new HasOneRelation(model, field);
  }

  static hasManyThrough<M extends Model, MThrough extends Model>(
    related: ModelConstructor<M>,
    relatedThroug: ModelConstructor<MThrough>,
    field: string,
    fieldThroug: string
  ) {
    return new HasManyThroughRelation(
      related,
      relatedThroug,
      field,
      fieldThroug
    );
  }

  static belongsToMany<M extends Model, MPivot extends Model>(
    related: ModelConstructor<M>,
    relatedPivot: ModelConstructor<MPivot>,
    modelField: string,
    relatedField: string
  ) {
    return new BelongsToManyRelation(
      related,
      relatedPivot,
      modelField,
      relatedField
    );
  }
}

export class HasOneRelation<M extends Model> extends Relation<M> {
  override getFor<T extends Model>(model: T, database: Database): M {
    return database
      .query(this.related)
      .where(this.field, "$eq", model.$primary())
      .getFirst();
  }
}

export class HasManyRelation<M extends Model> extends Relation<M> {
  override getFor<T extends Model>(model: T, database: Database): M[] {
    return database
      .query(this.related)
      .where(this.field, "$eq", model.$primary())
      .get();
  }
}

export class BelongsToRelation<M extends Model> extends Relation<M> {
  override getFor<T extends Model>(model: T, database: Database): M {
    return (
      database
        .query(this.related)
        // @ts-ignore
        .byPrimary([model[this.field]])
        .getFirst()
    );
  }
}

export class HasManyThroughRelation<
  M extends Model,
  MThrough extends Model
> extends Relation<M> {
  declare fieldThroug: string;
  declare relatedThroug: ModelConstructor<MThrough>;

  constructor(
    related: ModelConstructor<M>,
    relatedThroug: ModelConstructor<MThrough>,
    field: string,
    fieldThroug: string
  ) {
    super(related, field);
    this.fieldThroug = fieldThroug;
    this.relatedThroug = relatedThroug;
  }
  override getFor<T extends Model>(model: T, database: Database): M[] {
    const relatedThroug = database
      .query(this.relatedThroug)
      .where(this.fieldThroug, "$eq", model.$primary())
      .get();
    // @ts-ignore
    return database
      .query(this.related)
      .where(
        this.field,
        "$in",
        relatedThroug.map((m) => m.$primary())
      )
      .get();
  }
}

export class BelongsToManyRelation<
  M extends Model,
  MPivot extends Model
> extends Relation<M> {
  declare relatedField: string;
  declare relatedPivot: ModelConstructor<MPivot>;

  constructor(
    related: ModelConstructor<M>,
    relatedPivot: ModelConstructor<MPivot>,
    modelField: string,
    relatedField: string
  ) {
    super(related, modelField);
    this.relatedField = relatedField;
    this.relatedPivot = relatedPivot;
  }

  override getFor<T extends Model>(model: T, database: Database): M[] {
    const relatedPivot = database
      .query(this.relatedPivot)
      .where(this.field, "$eq", model.$primary())
      .get();
    if (relatedPivot.length === 0) return [];
    return (
      database
        .query(this.related)
        // @ts-ignore
        .byPrimary(relatedPivot.map((m) => m[this.relatedField]))
        .get()
    );
  }
}
