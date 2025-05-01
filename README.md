<p align="center">
    <img src="./tiki-db.png" width="220">
</p>
<h4 align="center">
  A storage-agnostic ORM 
</h4>

`TikiDB` is a lightweight and flexible data access abstraction for JavaScript/TypeScript applications, offering strong TypeScript support. <br/>
It supports multiple storage backends and can optionally integrate with any reactive framework.

---

Inspirations for `TikiDB`: <br />
**[RxDB](https://github.com/pubkey/rxdb)** /
**[WatermelonDB](https://github.com/Nozbe/WatermelonDB)** /
**[Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)** /
**[Pinia Orm](https://github.com/codedredd/pinia-orm)**

To provide a better alternative, I created TikiDB after analyzing these libraries.
[Check out this link for a comparison table of them.](https://github.com/etienne1698/tiki-db/blob/main/feature-comparison.md)


## 📦 Installation

Install `TikiDB` via npm:

```sh
npm install tiki-db
```

## 🧑‍💻 Contributors

Generate tests for your storage:

```sh
npx tiki-db-storage-contributor-cli
```

## 🗺️ Roadmap (suggest more if needed!)

| Storage Engine | Status | NPM package   |
| -------------- | ------ | ------------- |
| `In-Memory`    | ✅     | `tiki-db`     |
| `localStorage` | ❌     | -             |
| `IndexedDB`    | 🚧     | `tiki-db-idb` |
| `OPFS`         | ❌     | -             |
| `sql.js`       | ❌     | -             |

| Reactive Framework | Status | NPM package   |
| ------------------ | ------ | ------------- |
| `Vue`              | 🚧     | `tiki-db-vue` |
| `React`            | ❌     | -             |
| `Angular`          | ❌     | -             |

| Extension              | Status | Notes                         | NPM package |
| ---------------------- | ------ | ----------------------------- | ----------- |
| `syncEngine`           | ❌     | Core sync logic               | -           |
| `httpReplication`      | ❌     | Sync over HTTP                | -           |
| `websocketReplication` | ❌     | Real-time sync with WebSocket | -           |


---

⚠️ `TikiDB` is still under development, and some breaking changes may occur in the future. While the general usage shouldn't change much, a few aspects are still being reconsidered:

- "Reactive wrappers" will likely wrap the storage directly, rather than the database and collections.
- The `asyncDatabase()` function is expected to be removed in favor of a unified `database()` function.
- The generic TypeScript parameter "IsAsync" (on Database, QueryBuilder, Storage, and Collection) is planned to be removed.

Most of the current issues I'm facing are related to TypeScript's limitations with higher-kinded types. Once I find elegant solutions to work around these, I'll release the library as a stable v1.