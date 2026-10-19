import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.spec.ts'],
    testTimeout: 30_000,
    hookTimeout: 240_000,
    fileParallelism: false,
  },
});
