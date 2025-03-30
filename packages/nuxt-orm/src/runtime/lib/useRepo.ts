import {
  Repository,
  type Database,
  type Model,
  type ModelConstructor,
} from "vue-orm.js";
import useDb from "./useDb";

const repositories: Record<string, Repository> = {};

export default function useRepo<M extends Model>(
  use: ModelConstructor<M>,
  database?: Database
) {
  const db = database || useDb();
  if (!repositories[use.entity]) {
    repositories[use.entity] = Repository.createWithOptions<M>({
      use,
      database: db,
    });
    return repositories[use.entity];
  }
  return Repository.withOptions(repositories[use.entity], { database: db });
}
