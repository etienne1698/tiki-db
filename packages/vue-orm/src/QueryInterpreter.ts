import { Query } from "./Query";

export type QueryInterpreterContext = {
  next: () => void;
  query: Query;
};

export type QueryInterpreter = <T>(c: QueryInterpreterContext) => T;
