module.exports = {
  bracketSpacing: true,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: '*.sol',
      options: {
        bracketSpacing: true,
        explicitTypes: 'always',
        printWidth: 120,
        singleQuote: false,
        tabWidth: 4,
        useTabs: false,
      },
    },
  ],
};
