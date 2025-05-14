## ⚠️ Limitations for Server-Side Rendering (SSR)

**[Back to table of contents](./index.md)**

While `TikiDB` is compatible with both client-side and server-side environments, care must be taken when using it in SSR contexts (such as Nuxt or Next.js).

- **Avoid using global or shared database/storage instances on the server**, as this can lead to state leaking between concurrent user requests. Instead, create a fresh storage and database instance per request, or use a properly scoped dependency injection mechanism.
- **Be cautious when using different storage backends** on the client and the server (e.g., `InMemoryStorage` on the server and `IndexedDBStorage` on the client). If the storage contents differ, it can cause **hydration mismatches** or inconsistent initial states.


To address these SSR limitations, you can use 
- [tiki-db-nuxt](./extensions/nuxt.md)
- [tiki-db-next](./extensions/next.md)

These packages implement this strategy to provide a good SSR experience: 
- Expose a hook to get the current DB instance (create or reuse it when needed)
- Use `InMemoryStorage` on the server and merge the state during hydration
- Reuse the results of server-side queries and re-run queries once hydration is complete
