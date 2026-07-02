import './ui/style.css';
import { GameApp } from './game/GameApp';

const root = document.getElementById('app');
if (!root) throw new Error('#app root missing');

new GameApp().init(root).catch((err: unknown) => {
  console.error(err);
  root.textContent = `Failed to start: ${String(err)}`;
});
