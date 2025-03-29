import type Database from "./Database";
import type Model from "./Model";
import QueryBuilder from "./QueryBuilder";
import Repository from "./Repository";
import type { ModelConstructor } from "./types";

export default abstract class Relation<M extends Model = Model> {
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
}

export class HasOneRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return new QueryBuilder<M>(
      new Repository({ database, use: this.related })
    ).where(this.field, "$eq", model.$primaryKey());
  }

  override getFor<T extends Model>(model: T, database: Database): M {
    return this.queryFor(model, database).getFirst();
  }
}

export class HasManyRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return new QueryBuilder<M>(
      new Repository({ database, use: this.related })
    ).where(this.field, "$eq", model.$primaryKey());
  }

  override getFor<T extends Model>(model: T, database: Database): M[] {
    return this.queryFor(model, database).get();
  }
}

export class BelongsToRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return new QueryBuilder<M>(
      new Repository({ database, use: this.related })
    ).filter((r) => {
      // @ts-ignore
      return r.$primaryKey() == model[this.field];
    });
  }

  override getFor<T extends Model>(model: T, database: Database): M {
    return this.queryFor(model, database).getFirst();
  }
}
