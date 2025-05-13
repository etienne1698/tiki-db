
## 🗺️ Roadmap (suggest more if needed!)

**[TikiDB README.md](../README.md)**

| Storage Engine | Status | NPM package   |
| -------------- | ------ | ------------- |
| `In-Memory`    | ✅     | `tiki-db`     |
| `localStorage` | ❌     | -             |
| `IndexedDB`    | 🚧     | `tiki-db-idb` |
| `OPFS`         | ❌     | -             |
| `sql.js`       | ❌     | -             |

| Reactive Framework | Status | NPM package    |
| ------------------ | ------ | -------------- |
| `Vue`              | ✅     | `tiki-db-vue`  |
| `Nuxt`             | ✅     | `nuxt-tiki-db` |
| `React`            | ❌     | -              |
| `Next`             | ❌     | -              |
| `Angular`          | ❌     | -              |
| `Svelte`           | ❌     | -              |

| Extension              | Status | Notes                                         | NPM package |
| ---------------------- | ------ | --------------------------------------------- | ----------- |
| `Migrations`           | 🚧     | Migrations plugin (for storages that need it) | -           |
| `syncEngine`           | ❌     | Core sync logic                               | -           |
| `httpReplication`      | ❌     | Sync over HTTP                                | -           |
| `websocketReplication` | ❌     | Real-time sync with WebSocket                 | -           |

---

⚠️ `TikiDB` is still under development, and some breaking changes may occur in the future. While the general usage shouldn't change much, a few aspects are still being reconsidered:

- "Reactive wrappers" will likely wrap the storage directly, rather than the database and collections.
- The `asyncDatabase()` function is expected to be removed in favor of a unified `database()` function.
- The generic TypeScript parameter "IsAsync" (on Database, QueryBuilder, Storage, and Collection) is planned to be removed.

Most of the current issues I'm facing are related to TypeScript's limitations with higher-kinded types. Once I find elegant solutions to work around these, I'll release a stable v1