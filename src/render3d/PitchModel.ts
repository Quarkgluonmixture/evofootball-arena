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

  // Corner flags — taller and brighter so restarts read from tactical range.
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 6);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
  const flagGeo = new THREE.ConeGeometry(0.32, 0.55, 4);
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, emissive: 0x4a3b02, roughness: 0.6,
  });
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(sx * HALF_L, 1.0, sz * HALF_W);
      pole.castShadow = true;
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.rotation.z = Math.PI / 2;
      flag.position.set(sx * HALF_L - sx * 0.27, 1.78, sz * HALF_W);
      group.add(pole, flag);
    }
  }

  addTerraces(group);
  addFloodlights(group);

  return group;
}

/**
 * Low-poly terrace silhouettes: three stepped slabs along the far touchline
 * and shallow banks behind each goal. Dark, non-reflective, shadow-receiving —
 * atmosphere without stealing focus from the pitch.
 */
function addTerraces(group: THREE.Group): void {
  const mat = new THREE.MeshStandardMaterial({ color: 0x131c30, roughness: 0.95 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a2742, roughness: 0.9 });
  const mk = (w: number, x: number, z: number, rot: number) => {
    for (let step = 0; step < 3; step++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 1.1, 2.4), step % 2 === 0 ? mat : seatMat);
      const off = 1.6 + step * 2.4;
      slab.position.set(
        x + Math.sin(rot) * off,
        0.55 + step * 1.1,
        z + Math.cos(rot) * off,
      );
      slab.rotation.y = rot;
      slab.receiveShadow = true;
      group.add(slab);
    }
  };
  mk(HALF_L * 2 + 6, 0, -HALF_W - 5.2, 0); // far side (behind the adboards)
  mk(HALF_W * 2 - 4, -HALF_L - 5.4, 0, Math.PI / 2); // behind -x goal
  mk(HALF_W * 2 - 4, HALF_L + 5.4, 0, -Math.PI / 2); // behind +x goal
}

/** Four corner floodlight towers with softly glowing heads. */
function addFloodlights(group: THREE.Group): void {
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x2a3550, roughness: 0.8 });
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xf5f7fa, emissive: 0xbdd4ff, emissiveIntensity: 0.9, roughness: 0.4,
  });
  const mastGeo = new THREE.CylinderGeometry(0.22, 0.34, 17, 6);
  const headGeo = new THREE.BoxGeometry(3.4, 1.5, 0.5);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const x = sx * (HALF_L + 8);
      const z = sz * (HALF_W + 7);
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(x, 8.5, z);
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(x, 17.4, z);
      head.lookAt(0, 0, 0);
      group.add(mast, head);
    }
  }
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

  // Grass base: darker apron, then dual-direction mowing inside the lines —
  // broad lengthwise stripes with a faint crosshatch for a groomed look.
  ctx.fillStyle = '#1f5c2e';
  ctx.fillRect(0, 0, cw, ch);
  const stripes = 14;
  const stripeW = (HALF_L * 2 * PX) / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#2d7a3e' : '#37904b';
    ctx.fillRect(X(-HALF_L) + i * stripeW, Z(-HALF_W), stripeW, HALF_W * 2 * PX);
  }
  const cross = 8;
  const crossH = (HALF_W * 2 * PX) / cross;
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let i = 0; i < cross; i += 2) {
    ctx.fillRect(X(-HALF_L), Z(-HALF_W) + i * crossH, HALF_L * 2 * PX, crossH);
  }

  // Grain: deterministic speckle so the surface reads as turf, not plastic.
  // (LCG — purely cosmetic, stable across reloads.)
  let lcg = 1234567;
  const rand = () => ((lcg = (lcg * 48271) % 2147483647) / 2147483647);
  for (let i = 0; i < 260; i++) {
    const px = X(-HALF_L) + rand() * HALF_L * 2 * PX;
    const pz = Z(-HALF_W) + rand() * HALF_W * 2 * PX;
    const r = (0.35 + rand() * 2.2) * PX;
    ctx.fillStyle = rand() < 0.5 ? 'rgba(16,52,26,0.06)' : 'rgba(214,255,214,0.045)';
    ctx.beginPath();
    ctx.arc(px, pz, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(247,250,253,0.96)';
  ctx.lineWidth = 0.24 * PX;
  ctx.lineCap = 'round';

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

  // Corner arcs — where the Evo Cup's corners are actually taken.
  const cornerR = 1.2 * PX;
  const corners: Array<[number, number, number]> = [
    [X(-HALF_L), Z(-HALF_W), 0],
    [X(HALF_L), Z(-HALF_W), Math.PI / 2],
    [X(HALF_L), Z(HALF_W), Math.PI],
    [X(-HALF_L), Z(HALF_W), -Math.PI / 2],
  ];
  for (const [cx, cy, start] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, cornerR, start, start + Math.PI / 2);
    ctx.stroke();
  }

  // Penalty boxes, goal boxes, penalty spots and the arc ("D").
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
    const spotX = X(edge - side * BOX_DEPTH * 0.72);
    ctx.fillStyle = 'rgba(241,245,249,0.92)';
    ctx.beginPath();
    ctx.arc(spotX, Z(0), 0.22 * PX, 0, Math.PI * 2);
    ctx.fill();
    // The D: an arc outside the box, centered on the penalty spot.
    ctx.beginPath();
    const dR = 6.2 * PX;
    const boxEdgeX = X(edge - side * BOX_DEPTH);
    const half = Math.acos(Math.min(1, Math.abs(boxEdgeX - spotX) / dR));
    const facing = side > 0 ? Math.PI : 0; // arc opens away from the goal
    ctx.arc(spotX, Z(0), dR, facing - half, facing + half);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}
