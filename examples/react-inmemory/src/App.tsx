import { useSignals } from "@preact/signals-react/runtime";
import { db } from "./data/database";

const users = db.collections.users.findMany({ with: { posts: true } });

function removeUser(id: string) {
  db.collections.users.remove({ id: { $eq: id } });
}

function App() {
  useSignals();
  return (
    <>
      {users.value.map((u) => (
        <div key={u.id}>
          <pre>{JSON.stringify(u, null, 2)}</pre>
          <button onClick={() => removeUser(u.id!)}>remove</button>
        </div>
      ))}
    </>
  );
}

export default App;
