import { expect, test } from "vitest";
import { collections } from "../base_schema";

test("mapToDB should work", () => {
  const data = collections.users.model.mapToDB({
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
  const data = collections.users.model.mapFromDB({
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
