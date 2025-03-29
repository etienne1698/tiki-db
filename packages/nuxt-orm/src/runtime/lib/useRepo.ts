import {
  Repository,
  type Database,
  type Model,
  type ModelConstructor,
} from "vue-orm.js";
import useDb from "./useDb";

export default function useRepo<M extends Model>(
  use: ModelConstructor<M>,
  database?: Database
) {
  return Repository.createWithOptions<M>({
    database: database || useDb(),
    use,
  });
}
