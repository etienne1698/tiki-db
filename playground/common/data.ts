import { collection, model, relations, string } from "./re-export";

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

export default {
  users: collection(users, usersRelations),
  posts: collection(posts, postsRelations),
  comments: collection(comments, commentsRelations),
};
