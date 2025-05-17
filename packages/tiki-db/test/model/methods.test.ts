import { expect, test } from "vitest";
import { getTestDatabase } from "../in_memory/base";

test("mapToDB should work", () => {
  const { db } = getTestDatabase();

  const data = db.collections.users.schema.model.mapToDB({
    email: "",
    firstname: "",
    id: "1",
    lastname: "",
    phone: "",
  });

  expect(data).toStrictEqual({
    email: "",
    firstname: "",
    identifier: "1",
    lastname: "",
    phone: "",
  });
});


test("mapFromDB should work", () => {
  const { db } = getTestDatabase();

  const data = db.collections.users.schema.model.mapFromDB({
    email: "",
    firstname: "",
    identifier: "1",
    lastname: "",
    phone: "",
  });

  expect(data).toStrictEqual({
    email: "",
    firstname: "",
    id: "1",
    lastname: "",
    phone: "",
  });
});
