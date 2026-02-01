import antfu from "@antfu/eslint-config";

export default antfu({
  type: "lib",
  typescript: true,
  formatters: true,
  lessOpinionated: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["drizzle/*", "*.bru"],
}, {
  rules: {
    "func-style": ["error", "expression"],
    "ts/explicit-function-return-type": ["off"],
    "perfectionist/sort-imports": ["error"],
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: ["^.*\.md$"],
    }],
    "unused-imports/no-unused-vars": ["error", {
      caughtErrorsIgnorePattern: "^_",
    }],
    "node/prefer-global/buffer": ["off"],
    "node/prefer-global/process": ["off"],
  },
});
