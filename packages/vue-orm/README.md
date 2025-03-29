# VueORM

VueORM is a lightweight and efficient ORM library for Vue 3 that simplifies data normalization and relationship management using Vue `Ref`. It provides a structured way to handle entities and associations while keeping state management seamless and reactive.

## Installation

Install VueORM via npm:

```sh
npm install vue-orm.js
```

## Usage

### Exemple

```ts
import { VueDatabase, Model, Repository, Relation } from "../src/index";

class User extends Model {
  static override entity = "users";

  static override relations(): Record<string, Relation<any>> {
    return {
      pets: Relation.hasMany(Pet, "user_id"),
    };
  }

  declare id: string;
}

class Pet extends Model {
  static override entity = "users";

  declare id: string;
  declare user_id: string;
}

const db = new VueDatabase();

const usersRespo = Repository.createWithOptions({ use: User, database: db });
const petsRespo = Repository.createWithOptions({ use: Pet, database: db });

usersRespo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });
console.log(usersRespo.query().with("pets").get());
```
