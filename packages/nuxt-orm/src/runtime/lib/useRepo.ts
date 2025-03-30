import {
  Repository,
  type Constructor,
  type Database,
  type Model,
  type ModelConstructor,
} from "vue-orm.js";
import useDb from "./useDb";

function isModel<M extends Model>(data: any): data is ModelConstructor<M> {
  return Boolean(data?.entity);
}

export default function useRepo<M extends Model, R extends Repository<M>>(
  use: ModelConstructor<M> | Constructor<R>,
  db?: Database
): R {
  const database = db || useDb();
  const repository = isModel(use)
    ? (Repository.createWithOptions({
        database,
        use,
      }) as R)
    : new (use as Constructor<R>)().withOptions({
        database,
      });
  return repository;
}
