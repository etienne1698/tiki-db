# SaladORM

`SaladORM` is a lightweight abstraction layer for data access in Javascript/Typescript applications, with great Typescript support.

It provides a structured way to interact with data models and relationships while remaining storage-agnostic.

Inspirations:
- https://github.com/pubkey/rxdb
- https://github.com/drizzle-team/drizzle-orm


## Storage implementations

- [salad-orm-vue](https://github.com/etienne1698/salad-orm/tree/main/packages/salad-orm-vue) - salad-orm storage using vue `ref`


## Installation

Install SaladORM via npm:

```sh
npm install salad-orm
```

## Usage

```ts
import { collection, model, relations, string, database, inMemoryStorage } from "salad-orm";

const users = model("users", {
  id: string("id", ""),
  firstname: string("name", ""),
  lastname: string("lastname", ""),
  email: string("email", ""),
  age: string("age", ""),
});

const posts = model("posts", {
  id: string("id", ""),
  title: string("title", ""),
  content: string("content", ""),
  authorId: string("authorId", ""),
});

const comments = model("comments", {
  id: string("id", ""),
  postId: string("postId", ""),
  content: string("content", ""),
  authorId: string("authorId", ""),
});

const usersRelations = relations(users, ({ hasMany }) => ({
  posts: hasMany(posts, "authorId"),
}));

const postsRelations = relations(posts, ({ belongsTo, hasMany }) => ({
  author: belongsTo(users, "authorId"),
  comments: hasMany(comments, "postId"),
}));

const commentsRelations = relations(comments, ({ belongsTo }) => ({
  post: belongsTo(posts, "postId"),
  author: belongsTo(users, "authorId"),
}));

const db = database({
  users: collection(users, usersRelations),
  posts: collection(posts, postsRelations),
  comments: collection(comments, commentsRelations),
}, inMemoryStorage());
```