import type Model from "./Model";
import Repository from "./Repository";
import type { ModelConstructor } from "./types";

export default function useRepo<M extends Model>(m: ModelConstructor<M>) {
  const repository = new Repository<M>();
  repository.use = m;
  repository.init();
  return repository;
}
