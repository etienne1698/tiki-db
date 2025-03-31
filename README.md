# AbstracDB

AbstracDB is a lightweight abstraction layer for data access in JavaScript applications. It provides a structured way to interact with data models and relationships while remaining database-agnostic. 
AbstracDB itself is not intended to be used directly but rather through a specific database implementation, such as VueDatabase or IndexedDBDatabase.

more informations at [AbstracDB README](https://)

## Database implementations

- [abstracdb-vue](https://github.com/etienne1698/abstracdb/tree/main/packages/abstracdb-vue) - abstracdb using vue `ref`
- [abstracdb-nuxt](https://github.com/etienne1698/abstracdb/tree/main/packages/abstracdb-nuxt) - abstracdb using nuxt `useState`

## Examples

- [vue-example](https://github.com/etienne1698/abstracdb/tree/main/examples/vue-example) - Simple example using vue
- [nuxt-example](https://github.com/etienne1698/abstracdb/tree/main/examples/nuxt-example) - Simple example using nuxt

## ✅ TODO

- Relation :
  - hasManyBy
  - hasManyThrough
  - belongsToMany (with pivot)
- Relations composite key
- update/delete (with composite key)
- update/delete by query
