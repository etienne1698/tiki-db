import {
  model,
  collection,
  relations,
  string,
  Database,
  InferModelNormalizedType,
} from "./re-export";
import { faker } from "@faker-js/faker";

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

export const collections = {
  users: collection(users, usersRelations),
  posts: collection(posts, postsRelations),
  comments: collection(comments, commentsRelations),
};

export function seed(db: Database<typeof collections>) {
  db.collections.users.save(
    faker.helpers.multiple(
      (_, index) =>
        ({
          id: (index + 1).toString(),
          email: faker.internet.email(),
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          age: faker.number.int({ min: 12, max: 90 }).toString(),
        } as InferModelNormalizedType<typeof users>),
      { count: 20 }
    )
  );
}
