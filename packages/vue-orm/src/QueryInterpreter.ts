import { Query } from "./Query";

export type QueryInterpreterContext<T> = {
  next: () => T;
  query: Query;
};

export type QueryInterpreter = <T>(c: QueryInterpreterContext<T>) => T;
