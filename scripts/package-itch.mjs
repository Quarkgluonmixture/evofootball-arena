/**
 * Package the built game for itch.io: zip dist/ (index.html at the archive
 * root, exactly what itch's HTML5 player expects).
 *
 *   npm run package:itch      # builds first, then zips
 *
 * Output: release/evofootball-arena-<version>-itch.zip
 * Upload steps: docs/ITCH.md
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html not found — run `npm run build` first (or use `npm run package:itch`).');
  process.exit(1);
}

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const outDir = join(root, 'release');
mkdirSync(outDir, { recursive: true });
const zipPath = join(outDir, `evofootball-arena-${version}-itch.zip`);
rmSync(zipPath, { force: true });

// -j would flatten (breaking assets/); zip from inside dist so index.html
// sits at the archive root with its relative asset paths intact.
execFileSync('zip', ['-r', '-9', zipPath, '.'], { cwd: dist, stdio: 'inherit' });
console.log(`\npacked: ${zipPath}`);
console.log('next: see docs/ITCH.md for the upload settings.');
