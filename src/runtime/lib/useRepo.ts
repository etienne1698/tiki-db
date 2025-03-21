import type Model from "./Model";
import Repository from "./Repository";
import type { Constructor } from "./types";
import useDB from "./useDB";

export default function useRepo<M extends Model>(m: Constructor<M>) {
  const database = useDB();
  const repository = new Repository<M>();
  repository.use = m;
  repository.database = database;
  return repository;
}
