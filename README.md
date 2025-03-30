# VueORM / NuxtORM

VueORM (`vue-orm.js`) is a lightweight and efficient ORM library for Vue 3 that simplifies data normalization and relationship management using Vue’s `Ref`. It provides a structured way to handle entities and associations while keeping state management seamless and reactive.

VueORM is also compatible with Nuxt through the `nuxt-orm` module, which leverages the `useState` composable 

## Packages

- [vue-orm.js](https://github.com/etienne1698/nuxt-orm/tree/main/packages/vue-orm) - state/relationships managment for vue
- [nuxt-orm](https://github.com/etienne1698/nuxt-orm/tree/main/packages/nuxt-orm) - vue-orm.js for nuxt

## Examples

- [vue-example](https://github.com/etienne1698/nuxt-orm/tree/main/examples/vue-example) - Simple example using vue
- [nuxt-example](https://github.com/etienne1698/nuxt-orm/tree/main/examples/nuxt-example) - Simple example using nuxt

## ✅ TODO

- Relation :
  - hasManyBy
  - hasManyThrough
  - belongsToMany (with pivot)
- Relations composite key
- update/delete (with composite key)
- update/delete by query
