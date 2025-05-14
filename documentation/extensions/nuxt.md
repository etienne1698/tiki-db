## Nuxt

**[Back to table of contents](../index.md)**

`TikiDB` has some limitations on SSR, see [Limitations for Server-Side Rendering (SSR)](../ssr_limitations.md)

`tiki-db-nuxt` provides a solution to these SSR limitations

⚠️ This is experimental, not really production ready

- The `useDatabase` hook is used to manage database instances. You pass a callback to create the database, and useDatabase will create (or reuse) it when needed.
- In your database definition, wrap the storage with `nuxtStorageWrapper`. This will create an `InMemoryStorage` on the server and your chosen storage on the client. The `useDatabase` hook takes care of merging the state between these two.
- Server-side query results are reused and queries are re-run once hydration is complete (🚧 not done yet)