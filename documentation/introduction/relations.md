## Defining Relations

**[Back to table of contents](../index.md)**

Relations are defined using the `relations()` function, which takes a model and a callback function:

### One-to-Many Relations

```javascript
const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts, {
    fields: ["id"],
    references: ["userId"],
  }),
}));
```

### One-to-One Relations

```javascript
const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: ["userId"],
    references: ["id"],
  }),
}));
```

The callback function receives an object with `one` and `many` functions, which you can use to define relations:

- `one`: Used to define a one-to-one relation
- `many`: Used to define a one-to-many relation

Both functions take the related model as the first argument and a configuration object as the second argument. The configuration object specifies the fields in the current model and the referenced fields in the related model.
