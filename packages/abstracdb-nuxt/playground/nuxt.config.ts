export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },
  compatibilityDate: "2025-03-21",
  nuxtOrm: {
    defaultDatabase: {
      prefix: "db_",
    },
  },
});
