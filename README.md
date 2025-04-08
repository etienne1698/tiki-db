<p align="center">
    <img src="./tiki-db.png" width="220">
</p>
<h4 align="center">
  A storage-agnostic database framework for frontend applications <br />
  Compatible with <em>Vue</em> and <em>React</em>
</h4>

`TikiDB` is a lightweight abstraction layer for data access in Javascript/Typescript applications, with great Typescript support.

It provides a structured way to interact with data models and relationships while remaining storage-agnostic.

Inspirations:
- https://github.com/pubkey/rxdb
- https://github.com/Nozbe/WatermelonDB
- https://github.com/drizzle-team/drizzle-orm
- https://github.com/codedredd/pinia-orm


## Storage implementations

- [tiki-db-vue](https://github.com/etienne1698/tiki-db/tree/main/packages/tiki-db-vue) - tiki-db storage using vue `ref`


## Installation

Install TikiDB via npm:

```sh
npm install tiki-db
```

## Brainstorming 

- Le "storage" devrais etre async pour permettre le traitement des erreur 

Je pense que tout ce qui est index, logique de recherche... peut etre commun 
J'imagine que c'est simplement la recuperations du store pour chaque collection qui est spécifique a chaque implémentation

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