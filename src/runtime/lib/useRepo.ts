import type Model from "./Model";
import Repository from "./Repository";
import type { Constructor } from "./types";
import { useState } from "#app";

export default function useRepo<M extends Model>(m: Constructor<M>) {
  const repository = new Repository<M>();
  repository.use = m;
  const entity = m.prototype.constructor.name as string;
  repository.state = useState(entity, () => ({}));
  repository.init();
  return repository;
}
