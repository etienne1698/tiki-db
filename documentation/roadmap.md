## 🗺️ Roadmap (suggest more if needed!)

**[TikiDB README.md](../README.md)**

| Storage Engine | Status | NPM package   |
| -------------- | ------ | ------------- |
| `In-Memory`    | ✅     | `tiki-db`     |
| `IndexedDB`    | 🚧     | `tiki-db-idb` |
| `sql.js`       | ❌     | -             |
| `pg`           | ❌     | -             |
| `node SQLite`  | ❌     | -             |

| Reactive Framework | Status | NPM package     |
| ------------------ | ------ | --------------- |
| `Vue`              | ✅     | `tiki-db-vue`   |
| `Nuxt`             | 🚧     | `tiki-db-nuxt`  |
| `React`            | ✅     | `tiki-db-react` |
| `Angular`          | ❌     | -               |
| `Svelte`           | ❌     | -               |

| Extension        | Status | Notes                                         | NPM package |
| ---------------- | ------ | --------------------------------------------- | ----------- |
| `Migrations`     | 🚧     | Migrations plugin (for storages that need it) | -           |
| `syncEngine`     | 🚧     | Core sync logic                               | -           |
| `Zod validators` | 🚧     | Create validators from your DB schema         | -           |

| CLI description Status                 | Status | Command                               |
| -------------------------------------- | ------ | ------------------------------------- |
| Generate tests for your storage        | 🚧     | `npx tiki-db-storage-contributor-cli` |
| Generate migrations from you DB schema | ❌     | -                                     |

---

Prior to releasing a stable v1, the following items need to be completed:

- update should have a "saveRelation" param
- The dbName properties (in both Model and Field) are not yet used. Add optional support for mapping fields to and from the database during insert, update, and find operations.
- Complete and thoroughly test the migration plugin.
- Add more field types (object, boolean, date...)
- Add indexes support
- SyncEngine

---

⚠️ `TikiDB` is still under development, and some breaking changes may occur in the future. While the general usage shouldn't change much, a few aspects are still being reconsidered:

- The `asyncDatabase()` function is expected to be removed in favor of a unified `database()` function.
- The generic TypeScript parameter "IsAsync" (on Database, QueryBuilder, Storage, and Collection) is planned to be removed.

Most of the current issues I'm facing are related to TypeScript's limitations with higher-kinded types. Once I find elegant solutions to work around these, I'll release a new major version.
