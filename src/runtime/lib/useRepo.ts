import Database from "./Database";
import type Model from "./Model";
import Repository from "./Repository";
import type { ModelConstructor } from "./types";

export default function useRepo<M extends Model>(
  m: ModelConstructor<M>,
  db?: Database
) {
  const database = db || new Database();
  const repository = new Repository<M>(database);
  repository.use = m;
  repository.init();
  return repository;
}
