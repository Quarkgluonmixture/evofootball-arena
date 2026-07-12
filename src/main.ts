import './ui/style.css';
import { GameApp } from './game/GameApp';

const root = document.getElementById('app');
if (!root) throw new Error('#app root missing');

new GameApp().init(root).catch((err: unknown) => {
  console.error(err);
  root.textContent = `Failed to start: ${String(err)}`;
});

// Build badge (user ask: which build is live after CI?) — tiny, dim,
// non-interactive; the value is the git tag+sha injected at build time.
const badge = document.createElement('div');
badge.textContent = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';
badge.style.cssText =
  'position:fixed;right:6px;bottom:4px;z-index:60;font:10px/1.2 monospace;' +
  'color:#8294b5;opacity:0.55;pointer-events:none;user-select:none;';
document.body.appendChild(badge);
