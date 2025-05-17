## 🧑‍💻 Contributors

**[TikiDB README.md](../README.md)**

Generate tests for your storage:

```sh
npx tiki-db-storage-contributor-cli
```

### ⚠ Storage implementations instructions
- Storage should call model.mapToDB before insert/update/upsert
- Storage should call mapFromDB after findMany/findFirst 
- Query is make with tsName of fields and not dbName, storage should be aware of this