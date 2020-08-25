const devMode = process.env.DevMode === 'true'
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: ['prettier', 'prettier/standard', 'plugin:vue/recommended'],
  plugins: ['vue', 'prettier'],
  rules: devMode
    ? {}
    : {
        'prettier/prettier': 'error',
        'vue/max-attributes-per-line': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/html-self-closing': 'off',
      },
}
