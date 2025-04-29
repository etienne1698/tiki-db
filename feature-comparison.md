Here is a feature comparison table of TikiDB with libraries that serve similar purposes.

These libraries weren't necessarily designed to meet the exact same needs as TikiDB and they are definitely worth a look! I wouldn't have been able to build TikiDB without the inspiration they provided.

I'm not claiming to be an expert on these libraries, and I may have made some mistakes in the table. Feel free to correct me if something seems off!

| Feature                                             | **TikiDB** | **RxDB**                                      | **WatermelonDB**                              | **Drizzle ORM**   | **Pinia ORM**      |
| --------------------------------------------------- | ---------- | --------------------------------------------- | --------------------------------------------- | ----------------- | ------------------ |
| **Server-side support**                             | ✅         | ✅                                            | ❌                                            | ✅                | ❌                 |
| **Client-side support**                             | ✅         | ✅                                            | ✅                                            | ✅                | ✅                 |
| **Storage agnostic**                                | ✅         | ✅                                            | ❌                                            | ⚠️ (SQL only)     | ❌                 |
| **Asynchronous & Synchronous (depends on storage)** | ✅         | ❌                                            | ❌                                            | ❌                | ❌                 |
| **Reactive framework agnostic**                     | ✅         | ⚠️ (force RxJS)                               | ✅                                            | ❌                | ❌                 |
| **Excellent TypeScript support**                    | ✅         | ⚠️ (relationship typing is limited or manual) | ⚠️ (relationship typing is limited or manual) | ✅                | ❌ (manual typing) |
| **"Offline first" (Sync Engine)**                   | 🕐🚧       | ✅                                            | ⚠️ (Not built-in)                             | ⚠️ (Not built-in) | ⚠️ (Not built-in)  |
