import * as THREE from 'three';
import {
  BOX_DEPTH, BOX_WIDTH, CENTER_CIRCLE_R, GOAL_WIDTH, HALF_L, HALF_W,
} from '../sim/constants';

/**
 * The playing surface: one plane with a procedurally painted canvas texture —
 * mowing stripes and every line in a single draw call. Corner flags are real
 * geometry. (Goals live in GoalModel; they must be 3D.)
 */
export function createPitch(maxAnisotropy: number): THREE.Group {
  const group = new THREE.Group();

  const apron = 5; // grass margin outside the touchlines
  const w = (HALF_L + apron) * 2;
  const h = (HALF_W + apron) * 2;
  const texture = paintPitchTexture(apron);
  texture.anisotropy = Math.min(8, maxAnisotropy);
  texture.colorSpace = THREE.SRGBColorSpace;

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.92, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Adboards: low procedural boards along the far side and behind the goals —
  // grounds the diorama without heavy assets.
  const boardGeo = new THREE.BoxGeometry(24, 0.9, 0.25);
  const boardMats = [0x16223a, 0x1d3a5f, 0x24304a].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 }),
  );
  const boards: Array<{ x: number; z: number; rot: number }> = [
    { x: -30, z: -HALF_W - 3.4, rot: 0 },
    { x: 0, z: -HALF_W - 3.4, rot: 0 },
    { x: 30, z: -HALF_W - 3.4, rot: 0 },
    { x: -HALF_L - 3.6, z: -18, rot: Math.PI / 2 },
    { x: -HALF_L - 3.6, z: 18, rot: Math.PI / 2 },
    { x: HALF_L + 3.6, z: -18, rot: Math.PI / 2 },
    { x: HALF_L + 3.6, z: 18, rot: Math.PI / 2 },
  ];
  boards.forEach((b, i) => {
    const mesh = new THREE.Mesh(boardGeo, boardMats[i % boardMats.length]);
    mesh.position.set(b.x, 0.45, b.z);
    mesh.rotation.y = b.rot;
    mesh.castShadow = true;
    group.add(mesh);
    // Accent stripe along the top edge.
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.08, 0.27),
      new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.6 }),
    );
    stripe.position.set(b.x, 0.92, b.z);
    stripe.rotation.y = b.rot;
    group.add(stripe);
  });

  // Corner flags.
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 6);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
  const flagGeo = new THREE.ConeGeometry(0.28, 0.5, 4);
  const flagMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.7 });
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(sx * HALF_L, 0.9, sz * HALF_W);
      pole.castShadow = true;
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.rotation.z = Math.PI / 2;
      flag.position.set(sx * HALF_L - sx * 0.25, 1.6, sz * HALF_W);
      group.add(pole, flag);
    }
  }

  return group;
}

function paintPitchTexture(apron: number): THREE.CanvasTexture {
  const PX = 16; // pixels per meter
  const cw = (HALF_L + apron) * 2 * PX;
  const ch = (HALF_W + apron) * 2 * PX;
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;

  const X = (x: number) => (x + HALF_L + apron) * PX;
  const Z = (z: number) => (z + HALF_W + apron) * PX;

  // Grass + mowing stripes (slightly darker outside the touchlines).
  ctx.fillStyle = '#256b36';
  ctx.fillRect(0, 0, cw, ch);
  const stripes = 12;
  const stripeW = (HALF_L * 2 * PX) / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#2d7a3e' : '#348a47';
    ctx.fillRect(X(-HALF_L) + i * stripeW, Z(-HALF_W), stripeW, HALF_W * 2 * PX);
  }

  // Subtle worn patches so the surface doesn't read as flat plastic.
  // Deterministic LCG — purely cosmetic, but stable across reloads.
  let lcg = 1234567;
  const rand = () => ((lcg = (lcg * 48271) % 2147483647) / 2147483647);
  for (let i = 0; i < 70; i++) {
    const px = X(-HALF_L) + rand() * HALF_L * 2 * PX;
    const pz = Z(-HALF_W) + rand() * HALF_W * 2 * PX;
    const r = (0.8 + rand() * 2.4) * PX;
    ctx.fillStyle = rand() < 0.5 ? 'rgba(20,60,30,0.05)' : 'rgba(220,255,220,0.04)';
    ctx.beginPath();
    ctx.arc(px, pz, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(245,248,252,0.95)';
  ctx.lineWidth = 0.18 * PX;

  // Touchlines + halfway line.
  ctx.strokeRect(X(-HALF_L), Z(-HALF_W), HALF_L * 2 * PX, HALF_W * 2 * PX);
  ctx.beginPath();
  ctx.moveTo(X(0), Z(-HALF_W));
  ctx.lineTo(X(0), Z(HALF_W));
  ctx.stroke();

  // Center circle + spot.
  ctx.beginPath();
  ctx.arc(X(0), Z(0), CENTER_CIRCLE_R * PX, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(241,245,249,0.92)';
  ctx.beginPath();
  ctx.arc(X(0), Z(0), 0.25 * PX, 0, Math.PI * 2);
  ctx.fill();

  // Penalty boxes and goal boxes.
  for (const side of [-1, 1]) {
    const edge = side * HALF_L;
    ctx.strokeRect(
      Math.min(X(edge), X(edge - side * BOX_DEPTH)),
      Z(-BOX_WIDTH / 2),
      BOX_DEPTH * PX,
      BOX_WIDTH * PX,
    );
    const gbDepth = BOX_DEPTH * 0.45;
    const gbWidth = GOAL_WIDTH + 6;
    ctx.strokeRect(
      Math.min(X(edge), X(edge - side * gbDepth)),
      Z(-gbWidth / 2),
      gbDepth * PX,
      gbWidth * PX,
    );
  }

  return new THREE.CanvasTexture(canvas);
}
