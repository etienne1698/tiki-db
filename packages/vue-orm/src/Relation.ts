import type { Database } from "./Database";
import type { Model } from "./Model";
import { QueryBuilder } from "./QueryBuilder";
import { Repository } from "./Repository";
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
}

export class HasOneRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return Repository.createWithOptions({ database, use: this.related })
      .query()
      .where(this.field, "$eq", model.$primary());
  }

  override getFor<T extends Model>(model: T, database: Database): M {
    return this.queryFor(model, database).getFirst();
  }
}

export class HasManyRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return Repository.createWithOptions<M>({ database, use: this.related })
      .query()
      .where(this.field, "$eq", model.$primary());
  }

  override getFor<T extends Model>(model: T, database: Database): M[] {
    return this.queryFor(model, database).get();
  }
}

export class BelongsToRelation<M extends Model> extends Relation<M> {
  queryFor<T extends Model>(model: T, database: Database) {
    return Repository.createWithOptions<M>({ database, use: this.related })
      .query()
      .filter((r) => {
        // @ts-ignore
        return r.$primary() == model[this.field];
      });
  }

  override getFor<T extends Model>(model: T, database: Database): M {
    return this.queryFor(model, database).getFirst();
  }
}
