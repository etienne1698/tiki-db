## Defining Models

Models are defined using the `model()` function, which takes a name and a schema object:

```javascript
import { model, string, number, boolean } from "tiki-db";

const users = model("users", {
  id: string("id", ""),
  firstname: string("firstname", ""),
  lastname: string("lastname", ""),
  email: string("email", ""),
  phone: string("phone", ""),
});
```

The first argument is the name of the model (in the database), and the second is an object defining the fields.