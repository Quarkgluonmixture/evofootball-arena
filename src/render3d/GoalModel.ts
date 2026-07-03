import * as THREE from 'three';
import { GOAL_DEPTH, GOAL_WIDTH, HALF_L } from '../sim/constants';

const CROSSBAR_H = 2.44;
const POST_R = 0.09;

/**
 * A real 3D goal: two posts, crossbar, angled back stanchions and a net made
 * of transparent grid-textured planes (back, top, both sides). The net lives
 * in its own subgroup so it can shake when a goal goes in (visual only).
 */
export class Goal3D {
  readonly group: THREE.Group;
  private net: THREE.Group;
  private shakeT = -1;

  /** @param dir +1 = goal on the +x end, -1 = goal on the -x end. */
  constructor(dir: 1 | -1) {
    const { group, net } = buildGoal(dir);
    this.group = group;
    this.net = net;
  }

  /** Ripple the net for ~0.7s. */
  shake(): void {
    this.shakeT = 0;
  }

  get isShaking(): boolean {
    return this.shakeT >= 0;
  }

  update(dt: number): void {
    if (this.shakeT < 0) return;
    this.shakeT += dt;
    const DUR = 0.7;
    if (this.shakeT >= DUR) {
      this.shakeT = -1;
      this.net.position.set(0, 0, 0);
      this.net.rotation.z = 0;
      return;
    }
    const decay = 1 - this.shakeT / DUR;
    this.net.position.x = Math.sin(this.shakeT * 46) * 0.16 * decay;
    this.net.position.z = Math.cos(this.shakeT * 38) * 0.1 * decay;
    this.net.rotation.z = Math.sin(this.shakeT * 30) * 0.02 * decay;
  }
}

function buildGoal(dir: 1 | -1): { group: THREE.Group; net: THREE.Group } {
  const group = new THREE.Group();
  const net = new THREE.Group();
  group.add(net);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22, metalness: 0.25 });
  const postGeo = new THREE.CylinderGeometry(POST_R, POST_R, CROSSBAR_H, 10);

  const halfW = GOAL_WIDTH / 2;
  const lineX = dir * HALF_L;
  const backX = dir * (HALF_L + GOAL_DEPTH);

  for (const sz of [-1, 1]) {
    const post = new THREE.Mesh(postGeo, frameMat);
    post.position.set(lineX, CROSSBAR_H / 2, sz * halfW);
    post.castShadow = true;
    group.add(post);

    // Back stanchion: slopes from the crossbar down to the back of the net.
    const len = Math.hypot(GOAL_DEPTH, CROSSBAR_H);
    const stanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 8), frameMat);
    stanchion.position.set((lineX + backX) / 2, CROSSBAR_H / 2, sz * halfW);
    stanchion.rotation.z = -dir * Math.atan2(GOAL_DEPTH, CROSSBAR_H);
    group.add(stanchion);
  }

  const bar = new THREE.Mesh(new THREE.CylinderGeometry(POST_R, POST_R, GOAL_WIDTH + POST_R * 2, 10), frameMat);
  bar.rotation.x = Math.PI / 2;
  bar.position.set(lineX, CROSSBAR_H, 0);
  bar.castShadow = true;
  group.add(bar);

  // Net planes with a repeating grid texture (finer + brighter for depth).
  const netMat = new THREE.MeshBasicMaterial({
    map: netTexture(),
    transparent: true,
    opacity: 0.78,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const addNet = (w: number, h: number, setup: (m: THREE.Mesh) => void) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), netMat);
    const tex = netMat.map as THREE.Texture;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(9, 4);
    setup(mesh);
    net.add(mesh);
  };
  // Back wall.
  addNet(GOAL_WIDTH, CROSSBAR_H, (m) => {
    m.position.set(backX, CROSSBAR_H / 2, 0);
    m.rotation.y = Math.PI / 2;
  });
  // Roof: lies flat from the crossbar back to the net's top rear edge.
  // PlaneGeometry(depth, width) + rotation.x=-90° maps local x -> world x
  // (goal depth) and local y -> world z (goal width). NOTE Three.js applies
  // euler X last — the previous y-then-x rotation combo stood this panel
  // upright as a 7 m-tall tower above the bar.
  addNet(GOAL_DEPTH, GOAL_WIDTH, (m) => {
    m.position.set((lineX + backX) / 2, CROSSBAR_H - 0.02, 0);
    m.rotation.x = -Math.PI / 2;
  });
  // Side walls.
  for (const sz of [-1, 1]) {
    addNet(GOAL_DEPTH, CROSSBAR_H, (m) => {
      m.position.set((lineX + backX) / 2, CROSSBAR_H / 2, sz * halfW);
    });
  }

  return { group, net };
}

function netTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 32, 32);
  ctx.strokeStyle = 'rgba(240,245,250,0.9)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 30, 30);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}
