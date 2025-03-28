import type Model from "./Model";
import QueryBuilder from "./QueryBuilder";
import type { ModelConstructor } from "./types";
import useRepo from "./useRepo";

export default abstract class Relation<M extends Model = Model> {
  abstract queryFor<T extends Model>(model: T): QueryBuilder<M>;
  abstract getFor<T extends Model>(model: T): M | M[];

  static hasMany<M extends Model>(model: ModelConstructor<M>, field: string) {
    const relation = new HasManyRelation();
    relation.related = model;
    relation.field = field;
    return relation;
  }

  static belongsTo<M extends Model>(model: ModelConstructor<M>, field: string) {
    const relation = new BelongsToRelation();
    relation.related = model;
    relation.field = field;
    return relation;
  }
}

export class HasManyRelation<M extends Model> extends Relation<M> {
  declare related: ModelConstructor<M>;
  declare field: string;

  queryFor<T extends Model>(model: T) {
    return new QueryBuilder<M>(useRepo(this.related)).where(
      this.field,
      "$eq",
      model.$primaryKey()
    );
  }

  override getFor<T extends Model>(model: T): M[] {
    return this.queryFor(model).get();
  }
}

export class BelongsToRelation<M extends Model> extends Relation<M> {
  declare related: ModelConstructor<M>;
  declare field: string;

  queryFor<T extends Model>(model: T) {
    return new QueryBuilder<M>(useRepo(this.related)).filter((r) => {
      // @ts-ignore
      return r.$primaryKey() == model[this.field];
    });
  }

  override getFor<T extends Model>(model: T): M {
    return this.queryFor(model).one();
  }
}
