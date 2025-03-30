import {
  Repository,
  type Constructor,
  type Database,
  type Model,
  type ModelConstructor,
} from "vue-orm.js";
import useDb from "./useDb";

export default function useRepo<M extends Model>(
  use: ModelConstructor<M> | Constructor<Repository>,
  db?: Database
) {
  const database = db || useDb();
  if (use instanceof Repository) {
    return Repository.withOptions(use, {
      database,
    });
  }
  return Repository.createWithOptions<M>({
    database,
    use: use as ModelConstructor<M>,
  });
}
