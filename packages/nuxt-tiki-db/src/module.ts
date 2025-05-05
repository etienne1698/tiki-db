import {
  defineNuxtModule,
  createResolver,
  addImports,
  addPlugin,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface NuxtTikiDBModuleOptions {}

export default defineNuxtModule<NuxtTikiDBModuleOptions>({
  meta: {
    name: "nuxt-tiki-db",
    configKey: "tikiDB",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    addImports([
      {
        name: "useDB",
        as: "useDB",
        from: resolver.resolve("./runtime/composables/useDB"),
      },
    ]);

    addImports([
      {
        name: "nuxtStorageWrapper",
        as: "nuxtStorageWrapper",
        from: resolver.resolve("./runtime/utils/nuxtStorageWrapper"),
      },
    ]);

    addPlugin(resolver.resolve("./runtime/plugins/databases_plugins"));
  },
});
