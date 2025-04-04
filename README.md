# SaladORM

SaladORM is a lightweight abstraction layer for data access in JavaScript applications. It provides a structured way to interact with data models and relationships while remaining database-agnostic. 
SaladORM itself is not intended to be used directly but rather through a specific database implementation, such as VueDatabase.

more informations at [SaladORM README](https://github.com/etienne1698/SaladORM/tree/main/packages/SaladORM)

## Storage implementations

- [salad-orm-vue](https://github.com/etienne1698/SaladORM/tree/main/packages/salad-orm-vue) - salad-orm storage using vue `ref`


## ✅ TODO

- Relation :
  - hasManyBy
  - belongsToMany (with pivot)
- Relations composite key
- update/delete (with composite key)
- update/delete by query


- SaladORM GitHub repository:
  - github actions to keep readme up to date
  - playground project
  - documentation