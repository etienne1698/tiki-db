import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addImports,
} from "@nuxt/kit";

export interface AbstracDBNuxtModuleOptions {
  defaultDatabase?: {
    prefix: string;
  };
}

export default defineNuxtModule<AbstracDBNuxtModuleOptions>({
  meta: {
    name: "abstracdb-nuxt",
    configKey: "abstracDBNuxt",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.options.alias["#nuxt_orm"] = resolver.resolve("./runtime");

    nuxt["options"]["runtimeConfig"]["public"]["dbPrefix"] =
      options.defaultDatabase?.prefix || "";

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin"));
    addImportsDir(resolver.resolve("./runtime/lib"));

    addImports([
      {
        from: "abstracdb",
        name: "Repository",
      },
      {
        from: "abstracdb",
        name: "QueryBuilder",
      },
      {
        from: "abstracdb",
        name: "Relation",
      },
      {
        from: "abstracdb",
        name: "Model",
      },
    ]);
  },
});
