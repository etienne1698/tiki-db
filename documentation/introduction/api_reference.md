## API Reference

### Model Functions

- `model(name, schema)`: Define a new model

- `string(name, defaultValue)`: Create a string field
- `number(name, defaultValue)`: Create a number field
- `array(name, defaultValue)`: Create an array field

### Relation Functions

- `relations(model, callback)`: Define relations for a model
- `one(relatedModel, config)`: Define a one-to-one relation
- `many(relatedModel, config)`: Define a one-to-many relation

### Database Functions

- `collection(model, relations)`: Create a collection schema from a model and its relations
- `database(collections, storage)`: Create a database instance
