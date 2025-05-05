## Creating a Database

**[Back to table of contents](../index.md)**

To create a database, use the `database()` function, which takes an object of collections schema and a storage implementation:

If your storage is asynchronous, you have to use the `asyncDatabase()` function that works the same as the `database()` function but takes an async storage.

```javascript
import { database, collection, InMemoryStorage } from 'tiki-db';

const storage = new InMemoryStorage();

const db = database(
  {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
  },
  storage
);
```

The `collection()` function combines a model with its relations to create a collection schema. The first argument is the model, and the second is the relations object.


