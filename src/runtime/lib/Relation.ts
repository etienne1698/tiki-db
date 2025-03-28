import type Model from "./Model";
import QueryBuilder from "./QueryBuilder";
import type { ModelConstructor } from "./types";
import useRepo from "./useRepo";

export default abstract class Relation<M extends Model = Model> {
  abstract queryFor<T extends Model>(model: T): QueryBuilder<M>;

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
}

export class BelongsToRelation<M extends Model> extends Relation<M> {
  declare related: ModelConstructor<M>;
  declare field: string;

  queryFor<T extends Model>(model: T) {
    return new QueryBuilder<M>(useRepo(this.related)).filter((r) => {
      return r.$primaryKey() == model[this.field];
    });
  }
}
