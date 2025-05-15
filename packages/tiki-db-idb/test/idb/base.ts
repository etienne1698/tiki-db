import { collection, model, relations, string, asyncDatabase } from "tiki-db";
import { getTestStorage } from "./base_storage";

export async function getTestDatabase() {
  const users = model("usersDbName", {
    id: string("identifier", ""),
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

  const usersRelations = relations(users, ({ many }) => ({
    relatedPosts: many(posts, {
      fields: ["id"],
      references: ["userId"],
    }),
  }));

  const postsRelations = relations(posts, ({ one, many }) => ({
    relatedUser: one(users, {
      fields: ["userId"],
      references: ["id"],
    }),
    relatedComments: many(comments, {
      fields: ["id"],
      references: ["postId"],
    }),
  }));

  const commentsRelations = relations(comments, ({ one }) => ({
    relatedPost: one(posts, {
      fields: ["postId"],
      references: ["id"],
    }),
  }));

  const collections = {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
    comments: collection(comments, commentsRelations),
  };

  const storage = await getTestStorage();

  const db = asyncDatabase(collections, storage);
  await db.init();

  await storage.clearAll();

  return {
    db,
  };
}
