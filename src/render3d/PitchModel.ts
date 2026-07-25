import * as THREE from 'three';
import {
  BOX_DEPTH, BOX_WIDTH, CENTER_CIRCLE_R, FIELD_SCALE, GOAL_WIDTH, HALF_L, HALF_W,
} from '../sim/constants';
import { stylePreset, type StylePreset } from './stylePresets';

/**
 * The playing surface: one plane with a procedurally painted canvas texture —
 * mowing stripes and every line in a single draw call. Corner flags are real
 * geometry. (Goals live in GoalModel; they must be 3D.)
 *
 * Palette, turf grain, wear and paint softness all come from the F0 style
 * preset; the default preset repaints today's surface exactly.
 */
export function createPitch(maxAnisotropy: number, style: StylePreset = stylePreset()): THREE.Group {
  const group = new THREE.Group();

  const apron = 5; // grass margin outside the touchlines
  const w = (HALF_L + apron) * 2;
  const h = (HALF_W + apron) * 2;
  const texture = paintPitchTexture(apron, style);
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
  // grounds the diorama without heavy assets. Widths + positions scale with
  // FIELD_SCALE (2026-07-20 density相变): the fixed 24m board at ±30 spilled
  // past the shrunk pitch/stands (the green top-stripe "beams" poking out).
  const s = FIELD_SCALE;
  const boardGeo = new THREE.BoxGeometry(24 * s, 0.9, 0.25);
  const boardMats = style.boards.map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 }),
  );
  const boards: Array<{ x: number; z: number; rot: number }> = [
    { x: -30 * s, z: -HALF_W - 3.4 * s, rot: 0 },
    { x: 0, z: -HALF_W - 3.4 * s, rot: 0 },
    { x: 30 * s, z: -HALF_W - 3.4 * s, rot: 0 },
    { x: -HALF_L - 3.6 * s, z: -18 * s, rot: Math.PI / 2 },
    { x: -HALF_L - 3.6 * s, z: 18 * s, rot: Math.PI / 2 },
    { x: HALF_L + 3.6 * s, z: -18 * s, rot: Math.PI / 2 },
    { x: HALF_L + 3.6 * s, z: 18 * s, rot: Math.PI / 2 },
  ];
  boards.forEach((b, i) => {
    const mesh = new THREE.Mesh(boardGeo, boardMats[i % boardMats.length]);
    mesh.position.set(b.x, 0.45, b.z);
    mesh.rotation.y = b.rot;
    mesh.castShadow = true;
    group.add(mesh);
    // Accent stripe along the top edge.
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(24 * s, 0.08, 0.27),
      new THREE.MeshStandardMaterial({ color: style.boardStripe, roughness: 0.6 }),
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

  addTerraces(group, style);
  // A lit floodlight at noon is exactly the incoherence Track F exists to kill.
  if (style.floodlights) addFloodlights(group);

  return group;
}

/** One terrace step: `y` is the seat level ON TOP of the slab (the slab
 * mesh centers itself 0.55 below). Shared by the slab geometry here and
 * the animated CrowdSystem (Phase 66.1) so the crowd always sits exactly
 * on its steps. */
export interface TerraceSlab {
  w: number;
  x: number;
  y: number;
  z: number;
  rot: number;
}

/** The terrace step layout — three rows along the far touchline, one low
 * bank behind each goal (the 28.3 camera ceiling). Pure data. */
export function terraceSlabs(): TerraceSlab[] {
  const out: TerraceSlab[] = [];
  const mk = (w: number, x: number, z: number, rot: number, steps: number) => {
    for (let step = 0; step < steps; step++) {
      // Rows RECEDE as they rise (user report "观众应该阶梯向上"): the
      // offset marches AWAY from the pitch with height — the first cut
      // marched it toward the pitch, an inside-out grandstand whose back
      // row was the lowest. The anchor is the FRONT row, at the boards.
      const off = 1.6 + step * 2.4;
      out.push({
        w,
        x: x - Math.sin(rot) * off,
        y: 1.1 + step * 1.1,
        z: z - Math.cos(rot) * off,
        rot,
      });
    }
  };
  mk(HALF_L * 2 + 6, 0, -HALF_W - 1.8, 0, 3); // far side (front row behind the adboards)
  // Behind each goal: ONE low bank only (Phase 28.3). The old three-step
  // stands rose to 3.3m and reached x≈58 — the behind-goal camera (±57, y5)
  // sat INSIDE them and the whole goalmouth vanished behind a black slab
  // (failure mode 13's cousin: screenshot every fixed camera). The seated
  // crowd keeps the same ceiling: bodies top out ~1m above the low bank.
  mk(HALF_W * 2 - 4, -HALF_L - 2.2, 0, Math.PI / 2, 1); // behind -x goal
  mk(HALF_W * 2 - 4, HALF_L + 2.2, 0, -Math.PI / 2, 1); // behind +x goal
  return out;
}

/**
 * Low-poly terrace silhouettes on the shared slab layout. The SEATED crowd
 * itself moved to `CrowdSystem` (Phase 66.1, user ask "观众席也得有动作"):
 * it animates per frame, so it belongs to the renderer's update loop, not
 * the static pitch group.
 */
function addTerraces(group: THREE.Group, style: StylePreset): void {
  const mat = new THREE.MeshStandardMaterial({ color: style.terrace[0], roughness: 0.95 });
  const seatMat = new THREE.MeshStandardMaterial({ color: style.terrace[1], roughness: 0.9 });
  terraceSlabs().forEach((s, i) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(s.w, 1.1, 2.4), i % 2 === 0 ? mat : seatMat);
    slab.position.set(s.x, s.y - 0.55, s.z);
    slab.rotation.y = s.rot;
    slab.receiveShadow = true;
    group.add(slab);
  });
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

/**
 * Worn turf, painted as soft blotches over the mowing. The zones are where a
 * real pitch actually goes bare: both goalmouths, the centre circle, and the
 * two wing channels. `strength` scales blotch count and opacity together.
 */
function paintWear(
  ctx: CanvasRenderingContext2D,
  strength: number,
  color: string,
  rand: () => number,
  X: (x: number) => number,
  Z: (z: number) => number,
  PX: number,
): void {
  const zones: Array<{ x: number; z: number; rx: number; rz: number; w: number }> = [
    { x: -HALF_L + BOX_DEPTH * 0.35, z: 0, rx: BOX_DEPTH * 0.5, rz: GOAL_WIDTH * 1.1, w: 1 },
    { x: HALF_L - BOX_DEPTH * 0.35, z: 0, rx: BOX_DEPTH * 0.5, rz: GOAL_WIDTH * 1.1, w: 1 },
    { x: 0, z: 0, rx: CENTER_CIRCLE_R * 1.1, rz: CENTER_CIRCLE_R * 0.9, w: 0.65 },
    { x: 0, z: -HALF_W * 0.78, rx: HALF_L * 0.62, rz: HALF_W * 0.16, w: 0.5 },
    { x: 0, z: HALF_W * 0.78, rx: HALF_L * 0.62, rz: HALF_W * 0.16, w: 0.5 },
  ];
  const rgb = [
    parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16),
  ];
  for (const zone of zones) {
    const blotches = Math.round(90 * strength * zone.w);
    for (let i = 0; i < blotches; i++) {
      // Bias toward the zone centre so edges fade instead of ending hard.
      const t = rand() ** 0.7;
      const a = rand() * Math.PI * 2;
      const px = X(zone.x + Math.cos(a) * zone.rx * t);
      const pz = Z(zone.z + Math.sin(a) * zone.rz * t);
      const r = (0.4 + rand() * 1.5) * PX;
      const alpha = 0.17 * strength * zone.w * (1 - t * 0.75);
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(4)})`;
      ctx.beginPath();
      ctx.arc(px, pz, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function paintPitchTexture(apron: number, style: StylePreset): THREE.CanvasTexture {
  const g = style.grass;
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
  ctx.fillStyle = g.base;
  ctx.fillRect(0, 0, cw, ch);
  const stripeW = (HALF_L * 2 * PX) / g.stripes;
  for (let i = 0; i < g.stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? g.stripeA : g.stripeB;
    ctx.fillRect(X(-HALF_L) + i * stripeW, Z(-HALF_W), stripeW, HALF_W * 2 * PX);
  }
  const cross = 8;
  const crossH = (HALF_W * 2 * PX) / cross;
  ctx.fillStyle = `rgba(255,255,255,${g.crossAlpha})`;
  for (let i = 0; i < cross; i += 2) {
    ctx.fillRect(X(-HALF_L), Z(-HALF_W) + i * crossH, HALF_L * 2 * PX, crossH);
  }

  // Grain: deterministic speckle so the surface reads as turf, not plastic.
  // (LCG — purely cosmetic, stable across reloads.)
  let lcg = 1234567;
  const rand = () => ((lcg = (lcg * 48271) % 2147483647) / 2147483647);
  for (let i = 0; i < g.grainCount; i++) {
    const px = X(-HALF_L) + rand() * HALF_L * 2 * PX;
    const pz = Z(-HALF_W) + rand() * HALF_W * 2 * PX;
    const [rMin, rMax] = g.grainRadius;
    const r = (rMin + rand() * (rMax - rMin)) * PX;
    const dark = 0.06 * g.grainAlpha;
    const light = 0.045 * g.grainAlpha;
    ctx.fillStyle = rand() < 0.5 ? `rgba(16,52,26,${dark})` : `rgba(214,255,214,${light})`;
    ctx.beginPath();
    ctx.arc(px, pz, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wear (F0's toy arm; 0 elsewhere): a pitch that has been PLAYED on. Bare
  // goalmouths, a scuffed centre circle and worn wing channels — the thing
  // that separates a real surface from a green rectangle. Deterministic.
  if (g.wear > 0) paintWear(ctx, g.wear, g.wearColor, rand, X, Z, PX);

  ctx.strokeStyle = `rgba(247,250,253,${style.lineAlpha})`;
  ctx.lineWidth = style.lineWidth * PX;
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
