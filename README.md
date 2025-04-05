# SaladORM

`SaladORM` is a lightweight abstraction layer for data access in Javascript/Typescript applications, with great Typescript support.

It provides a structured way to interact with data models and relationships while remaining storage-agnostic.

Inspirations:
- https://github.com/pubkey/rxdb
- https://github.com/codedredd/pinia-orm
- https://github.com/drizzle-team/drizzle-orm


## Storage implementations

- [salad-orm-vue](https://github.com/etienne1698/salad-orm/tree/main/packages/salad-orm-vue) - salad-orm storage using vue `ref`


## Installation

Install SaladORM via npm:

```sh
npm install salad-orm
```

## Roadmap

- Core 
    - more tests + shared tests
    - basics storage wrapper:
        - backupStorage
        - log
        - throw
    - async database, query_runner, query_builder, storage 
- Storage
    - localStorage
    - IndexedDB
    - OPFS
- Extensions (as storage-wrapper)
    - validations
        - zod
        - arktype
    - replication 
        - syncEngine
        - httpReplication
        - websocketReplication
- For JS server runtimes (node, bun, deno)
    - replication
        - syncEngineServer
        - httpReplicationServer (hono, express, koa)
        - websocketReplicationServer