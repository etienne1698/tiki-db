import type Model from "./Model";
import QueryBuilder from "./QueryBuilder";
import type { ModelConstructor, PrimaryKey } from "./types";
import useRepo from "./useRepo";

export default abstract class Relation<M extends Model = Model> {
  abstract queryFor(primary: PrimaryKey): QueryBuilder<M>;

  static hasMany<M extends Model>(model: ModelConstructor<M>, field: string) {
    const relation = new HasManyRelation();
    relation.related = model;
    relation.field = field;
    return relation;
  }
}

export class HasManyRelation<M extends Model> extends Relation<M> {
  declare related: ModelConstructor<M>;
  declare field: string;

  queryFor(primary: PrimaryKey) {
    return new QueryBuilder<M>(useRepo(this.related)).where(
      this.field,
      "$eq",
      primary
    );
  }
}
