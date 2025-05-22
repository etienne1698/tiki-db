## 🧑‍💻 Contributors

**[TikiDB README.md](../README.md)**


### ⚠ Storage implementations instructions
- Storage should call model.mapToDB before insert/update/upsert
- Storage should call mapFromDB after findMany/findFirst 
- Query is make with tsName of fields and not dbName, storage should be aware of this
- Indexes (on model) is tsName and not dbName, storage should be aware of this