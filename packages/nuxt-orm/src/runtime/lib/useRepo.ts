import {
  Repository,
  type Constructor,
  type Database,
  Model,
  type ModelConstructor,
} from "vue-orm.js";
import useDb from "./useDb";

export default function useRepo<M extends Model, R extends Repository<M>>(
  use: ModelConstructor<M> | Constructor<R>,
  db?: Database
): R {
  const database = db || useDb();
  if (use instanceof Model) {
    return Repository.createWithOptions<M>({
      database,
      use: use as ModelConstructor<M>,
    }) as R;
  }
  return Repository.withOptions(new (use as Constructor<R>)(), {
    database,
  });
}
