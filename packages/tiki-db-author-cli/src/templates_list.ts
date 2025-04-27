import { TestsBaseTemplate } from "./templates/tests/base";
import { SimpleTestsTemplate } from "./templates/tests/simple_tests";

export const testsTemplates: {
  path: string;
  content: (isAsyncStorage: boolean, storageName: string) => string;
}[] = [
  {
    path: "base",
    content: TestsBaseTemplate,
  },
  {
    path: "simple.test",
    content: SimpleTestsTemplate,
  },
];
