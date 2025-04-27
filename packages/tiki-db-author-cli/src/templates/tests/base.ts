import { toCamelCase } from "../../utils";

export function TestsBaseTemplate(
  isAsyncStorage: boolean,
  storageName: string
) {
  return `
import {
  collection,
  model,
  relations,
  string,
  ${isAsyncStorage ? "asyncDatabase" : "database"},
} from "tiki-db";

export function getTestDatabase() {
  const users = model("usersDbName", {
    id: string("id", ""),
    firstname: string("firstname", ""),
    lastname: string("lastname", ""),
    email: string("email", ""),
    phone: string("phone", ""),
  });
  const posts = model("postsDbName", {
    id: string("id", ""),
    title: string("title", ""),
    content: string("content", ""),
    userId: string("userId", "").notNull(),
  });

  const comments = model("commentsDbName", {
    id: string("id", ""),
    title: string("title", ""),
    content: string("content", ""),
    postId: string("postId", "").notNull(),
  });

  const usersRelations = relations(users, ({ hasMany, hasManyThrough }) => ({
    relatedPosts: hasMany(posts, "userId"),
    relatedComments: hasManyThrough(comments, "postId", posts, "userId"),
  }));

  const postsRelations = relations(posts, ({ belongsTo, hasMany }) => ({
    relatedUser: belongsTo(users, "userId"),
    relatedComments: hasMany(comments, "postId"),
  }));

  const commentsRelations = relations(comments, ({ belongsTo }) => ({
    relatedPost: belongsTo(posts, "postId"),
  }));

  const collections = {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
    comments: collection(comments, commentsRelations),
  };

  const storage = new ${toCamelCase(storageName)}();
  const db = ${
    isAsyncStorage ? "asyncDatabase" : "database"
  }(collections, storage);
  db.init();

  return {
    db,
  };
}
`;
}
