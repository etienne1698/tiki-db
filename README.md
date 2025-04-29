<p align="center">
    <img src="./tiki-db.png" width="220">
</p>
<h4 align="center">
  A storage-agnostic ORM 
</h4>

`TikiDB` is a lightweight and flexible data access abstraction for JavaScript/TypeScript applications. It offers strong TypeScript support, supports multiple storage backends, and can optionally integrate with any reactive frameworks.

---

Supported storage backends (suggest more if needed!):
- IndexedDB
- In-Memory

Reactive framework adapters  (suggest more if needed!):
- Vue

## ✨ Inspirations:
- [RxDB](https://github.com/pubkey/rxdb)
- [WatermelonDB](https://github.com/Nozbe/WatermelonDB)
- [textDrizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Pinia Orm](https://github.com/codedredd/pinia-orm)


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

## 🗺️ Roadmap

| Storage Engine | Status |
|----------------|--------|
| `localStorage` | ❌ |
| `IndexedDB`    | 🚧 |
| `OPFS`         | ❌ |

| Extension                    | Type           | Status | Notes                                  |
|-----------------------------|----------------|--------|----------------------------------------|
| `syncEngine`                | Client         | ❌     | Core sync logic                        |
| `httpReplication`           | Client         | ❌     | Sync over HTTP                         |
| `websocketReplication`      | Client         | ❌     | Real-time sync with WebSocket          |
| `syncEngineServer`          | Server         | ❌     | Server-side sync logic                 |
| `httpReplicationServer`     | Server         | ❌     | REST sync API (Hono, Express, Koa...)     |
| `websocketReplicationServer`| Server         | ❌     | WebSocket sync server                  |