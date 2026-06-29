import configNymph from 'eslint-config-nymph';
import pluginJsdoc from 'eslint-plugin-jsdoc';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  configNymph,
  pluginJsdoc.configs['flat/recommended'],
  // Disable jsdoc param types (use TypeScript types)
  // and forbid JSDoc type annotations
  {
    rules: {
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/no-types': 'error',
    },
  },
  // Disable max-len for Vue SFCs
  {
    files: ['**/*.vue'],
    rules: {
      'max-len': 'off',
    },
  },
  // General rule overrides for this repository
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'camelcase': 'off',
      'guard-for-in': 'off',
      'vue/no-v-html': 'off',
      'max-len': 'off',
    },
  },
]);
