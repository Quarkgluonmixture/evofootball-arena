import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Several tests simulate full seasons (~5s on an idle machine). 20s keeps
    // the suite robust on loaded/thermally-throttled hardware while still
    // failing fast on genuine hangs (the sim itself has a 4× step safety net).
    testTimeout: 20000,
  },
});
