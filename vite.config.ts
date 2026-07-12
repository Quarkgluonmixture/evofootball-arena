import { execSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';

// Build identity for the corner badge (user ask: "加一个版本号,方便确认
// 是否上线") — the git tag+sha the bundle was built from; 'dev' if git is
// unavailable. CI checks out with tags (fetch-depth: 0) so `describe`
// yields e.g. `phase-31.9.1` or `phase-31.9.1-2-gf1c35b3`.
function gitVersion(): string {
  try {
    return execSync('git describe --tags --always --dirty', { encoding: 'utf8' }).trim();
  } catch {
    return 'dev';
  }
}

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(gitVersion()),
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Several tests simulate full seasons (~5s on an idle machine). 20s keeps
    // the suite robust on loaded/thermally-throttled hardware while still
    // failing fast on genuine hangs (the sim itself has a 4× step safety net).
    testTimeout: 20000,
  },
});
