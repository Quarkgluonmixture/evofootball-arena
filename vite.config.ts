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
    // CI runs ONE worker thread (fm 12's corollary, final form): on the
    // 2-core runner two worker threads contend for both cores, a match loop
    // can then hold its event loop past vitest's 60s RPC budget, and the run
    // dies with "[vitest-worker]: Timeout calling onTaskUpdate" — with all
    // tests GREEN (killed the phase-45..50 deploy twice; per-test setImmediate
    // yields only shrink the window). Single-threaded, the worker owns one
    // core and the orchestrator the other. Local runs keep full parallelism.
    poolOptions: {
      threads: { singleThread: !!process.env.CI },
      forks: { singleFork: !!process.env.CI },
    },
  },
});
