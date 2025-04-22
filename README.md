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



## Installation

Install TikiDB via npm:

```sh
npm install tiki-db
```

## Roadmap


- Storage
    - localStorage
    - IndexedDB
    - OPFS
- Extensions (as storage-wrapper)
    - replication 
        - syncEngine
        - httpReplication
        - websocketReplication
        - For JS server runtimes (node, bun, deno)
            - replication
                - syncEngineServer
                - httpReplicationServer (hono, express, koa)
                - websocketReplicationServer