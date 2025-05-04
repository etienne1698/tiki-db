import { expect, test } from "vitest";
import { getTestDatabase } from "./in_memory/base";
import { QueriesManager } from "../src";

test("queryManager queryConcerned by insert", () => {
  const { db } = getTestDatabase();
  const qm = new QueriesManager<any>();

  db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
  });

  const query = {
    filters: { id: { $eq: "1" } },
  };
  const findResult = db.collections.users.findFirst(query);
  qm.set(
    qm.hashQuery(db.collections.users.schema, query, true),
    db.collections.users.schema,
    true,
    query,
    findResult
  );

  expect(
    qm.getQueriesConcerned(db.collections.users.schema, [
      {
        id: "1",
        firstname: "Etienne",
      },
    ]).size
  ).toBe(1);
});

test("queryManager queryConcerned by insertMany", () => {
  const { db } = getTestDatabase();
  const qm = new QueriesManager<any>();

  const data = [
    {
      id: "1",
      firstname: "Etienne",
    },
    {
      id: "2",
      firstname: "Marc",
    },
  ];

  db.collections.users.insertMany(data);

  const query = {
    filters: { id: { $eq: "1" } },
  };
  const findResult = db.collections.users.findFirst(query);
  qm.set(
    qm.hashQuery(db.collections.users.schema, query, true),
    db.collections.users.schema,
    true,
    query,
    findResult
  );

  expect(
    qm.getQueriesConcerned(db.collections.users.schema, data).size
  ).toBe(1);
});
