// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt([
  {
    rules: {
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/comma-dangle": "off",
      "@stylistic/object-curly-spacing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/attribute-hyphenation": "off",
      "vue/max-attributes-per-line": ["error", {singleline: {max: 2}, multiline: {max: 2}}],
    },
  },
  {
    ignores: ["shared/types/database.types.ts"],
  },
])
