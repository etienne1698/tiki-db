import {
  Repository,
  type Constructor,
  type Database,
  Model,
  type ModelConstructor,
} from "vue-orm.js";
import useDb from "./useDb";

function isModel<M extends Model>(data: any): data is ModelConstructor<M> {
  return Boolean(data?.entity);
}

function initRepoClientSide(repository: Repository) {
  const repositoryHasDataNotMappedToEntity =
    Object.values(repository.state.value).length &&
    !(Object.values(repository.state.value)[0] instanceof Model);

  if (repositoryHasDataNotMappedToEntity) {
    for (const key of Object.keys(repository.state.value)) {
      repository.state.value[key] = Object.assign(
        new repository.use(),
        repository.state.value[key]
      );
    }
  }
}

export default function useRepo<M extends Model, R extends Repository<M>>(
  use: ModelConstructor<M> | Constructor<R>,
  db?: Database
): R {
  const database = db || useDb();
  const repository = isModel(use)
    ? (Repository.createWithOptions({
        database,
        use,
      }) as R)
    : Repository.withOptions(new (use as Constructor<R>)(), {
        database,
      });
  if (import.meta.client) initRepoClientSide(repository);
  return repository;
}
