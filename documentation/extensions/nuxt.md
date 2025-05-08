## Nuxt

`TikiDB` has some limitations on SSR, see [Limitations for Server-Side Rendering (SSR)](../introduction/ssr_limitations.md)

To address these SSR limitations, I’ve created `nuxt-tiki-db`

- The `useDatabase` hook is used to manage database instances. You pass a callback to create the database, and useDatabase will create (or reuse) it when needed.
- In your database definition, wrap the storage with `nuxtStorageWrapper`. This will create an `InMemoryStorage` on the server and your chosen storage on the client. The `useDatabase` hook takes care of merging the state between these two.