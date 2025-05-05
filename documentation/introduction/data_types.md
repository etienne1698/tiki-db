## Data Types

Tiki-DB supports several data types for defining model fields:

- `string(name, defaultValue)`: Creates a string field
- `number(name, defaultValue)`: Creates a number field
- `array(name, defaultValue)`: Creates an array field

Each data type function takes a field name (used in the database) as the first argument and an optional default value as the second argument.

Field modifiers:

- `.notNull()`: Makes the field required
