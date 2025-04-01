import type { Database } from "./Database";
import type { Model } from "./Model";
import { QueryBuilder } from "./QueryBuilder";
import type { ModelConstructor } from "./types";

export abstract class Relation<M extends Model = Model> {
  declare related: ModelConstructor<M>;
  declare field: string;

  constructor(related: ModelConstructor<M>, field: string) {
    this.related = related;
    this.field = field;
  }

  abstract queryFor<T extends Model>(
    model: T,
    database: Database
  ): QueryBuilder<M>;
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
    return new HasManyThroughRelation(related, relatedThroug, field, fieldThroug);
  }
}

export class HasOneRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return database
      .query(this.related)
      .where(this.field, "$eq", model.$primary());
  }

  override getFor<T extends Model>(model: T, database: Database): M {
    return this.queryFor(model, database).getFirst();
  }
}

export class HasManyRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return database
      .query(this.related)
      .where(this.field, "$eq", model.$primary());
  }

  override getFor<T extends Model>(model: T, database: Database): M[] {
    return this.queryFor(model, database).get();
  }
}

export class BelongsToRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    // @ts-ignore
    return database.query(this.related).byPrimary([model[this.field]]);
  }

  override getFor<T extends Model>(model: T, database: Database): M {
    return this.queryFor(model, database).getFirst();
  }
}

export class HasManyThroughRelation<M extends Model, MThrough extends Model> extends Relation<M> {
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

  queryFor<T extends Model>(model: T, database: Database) {
    const relatedThroug = database.query(this.relatedThroug).where(
      this.fieldThroug,
      "$eq",
      model.$primary()
    ).get();
    // @ts-ignore
    return database
      .query(this.related)
      .where(this.field, "$in", relatedThroug.map(m => m.$primary()));
  }

  override getFor<T extends Model>(model: T, database: Database): M[] {
    return this.queryFor(model, database).get();
  }
}
