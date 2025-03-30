import { Query } from "./Query";

export type QueryInterpreterContext = {
  next: QueryInterpreter;
  query: Query;
};

export type QueryInterpreter = <T>(c: QueryInterpreterContext) => T;
