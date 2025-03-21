import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      quotes: "double",
      semi: true,
      commaDangle: "only-multiline",
      quoteProps: "as-needed",
      braceStyle: "1tbs",
    },
  },
  dirs: {
    src: ["./playground"],
  },
}).append({
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/quote-props": "off",
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@stylistic/operator-linebreak": "off",
    "@stylistic/indent-binary-ops": "off",
    "@stylistic/arrow-parens": "off",
    "vue/attributes-order": "off",
    "prefer-regex-literals": "off",
    "regexp/prefer-d": "off",
    "unicorn/prefer-number-properties": "off",
  },
});
