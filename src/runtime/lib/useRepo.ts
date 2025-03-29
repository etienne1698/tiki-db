import type { Database } from "./Database";
import type Model from "./Model";
import Repository from "./Repository";
import type { ModelConstructor } from "./types";
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
