import type Database from "./Database";
import type Model from "./Model";
import Repository from "./Repository";
import type { ModelConstructor } from "./types";
import useDb from "./useDB";

export default function useRepo<M extends Model>(
  m: ModelConstructor<M>,
  db?: Database
) {
  const database = db || useDb();
  const repository = new Repository<M>(database);
  repository.use = m;
  repository.init();
  return repository;
}
