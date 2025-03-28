import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
} from "@nuxt/kit";

export interface NuxtORMModuleOptions {
  defaultDatabase?: {
    prefix: string;
  };
}

export default defineNuxtModule<NuxtORMModuleOptions>({
  meta: {
    name: "nuxt-orm",
    configKey: "nuxtOrm",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt["options"]["runtimeConfig"]["public"]["dbPrefix"] =
      options.defaultDatabase?.prefix || "";

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin"));
    addImportsDir(resolver.resolve("./runtime/lib"));
  },
});
