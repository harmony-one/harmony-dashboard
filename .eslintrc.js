const isProduction = process.env.NODE_ENV === 'production';
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
  rules: isProduction?{
    'prettier/prettier': 'error',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': 'off',
  }:{},
};
