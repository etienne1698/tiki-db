import {
  defineNuxtModule,
  createResolver,
  addImports,
  addPlugin,
} from "@nuxt/kit";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
        name: "useDatabase",
        as: "useDatabase",
        from: resolver.resolve("./runtime/composables/useDatabase"),
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
