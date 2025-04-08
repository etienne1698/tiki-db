import { faker } from "@faker-js/faker";
import {
  database,
  model,
  relations,
  collection,
  string,
  type InferModelNormalizedType,
} from "tiki-db";
import { vueStorage } from "tiki-db-vue";

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

export const db = database(
  {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
    comments: collection(comments, commentsRelations),
  },
  vueStorage()
);

export function seed() {
  // users
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

  // posts
  db.collections.posts.save(
    faker.helpers.multiple(
      (_, index) =>
        ({
          id: (index + 1).toString(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          authorId: (index + 1).toString(),
        } as InferModelNormalizedType<typeof posts>),
      { count: 10 }
    )
  );

  // comments
  db.collections.comments.save(
    faker.helpers.multiple(
      (_, index) => {
        const postsLength = db.collections.posts.all().length - 1;
        return {
          id: (index + 1).toString(),
          content: faker.lorem.sentence(),
          postId: (postsLength - index + 1).toString(),
          authorId: (index + 1).toString(),
        } as InferModelNormalizedType<typeof comments>;
      },
      { count: 10 }
    )
  );
}
seed();
