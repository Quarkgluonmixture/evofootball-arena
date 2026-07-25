import * as THREE from 'three';
import { HALF_L, HALF_W } from '../sim/constants';
import { stylePreset, type StylePreset } from './stylePresets';

/**
 * Scene, lights and atmosphere for the diorama-style pitch. No stadium —
 * a clean floating pitch on a dark backdrop matching the app theme.
 *
 * Every value comes from an F0 style preset; the default preset reproduces the
 * shipped look exactly, so passing nothing changes nothing.
 */
export function createScene(style: StylePreset = stylePreset()): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(style.background);
  scene.fog = style.fog
    ? new THREE.Fog(style.fog.color, style.fog.near, style.fog.far)
    : null;

  const hemi = new THREE.HemisphereLight(style.hemi.sky, style.hemi.ground, style.hemi.intensity);
  scene.add(hemi);

  // Toon ramps have no specular to lift them, so the toy arm buys a flat fill.
  if (style.ambient) {
    scene.add(new THREE.AmbientLight(style.ambient.color, style.ambient.intensity));
  }

  const sun = new THREE.DirectionalLight(style.sun.color, style.sun.intensity);
  sun.position.set(...style.sun.pos);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 62;
  sun.shadow.camera.left = -s;
  sun.shadow.camera.right = s;
  sun.shadow.camera.top = s * 0.75;
  sun.shadow.camera.bottom = -s * 0.75;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 180;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  // Pedestal under the pitch so the diorama reads as a solid object.
  const pedestal = new THREE.Mesh(
    new THREE.BoxGeometry(HALF_L * 2 + 14, 2.5, HALF_W * 2 + 14),
    new THREE.MeshStandardMaterial({ color: style.pedestal, roughness: 0.95 }),
  );
  pedestal.position.y = -1.3;
  pedestal.receiveShadow = true;
  scene.add(pedestal);

  return scene;
}

/** three's tone-mapping enum for a preset's setting. */
export function toneMappingFor(style: StylePreset): THREE.ToneMapping {
  if (style.toneMapping === 'aces') return THREE.ACESFilmicToneMapping;
  if (style.toneMapping === 'neutral') return THREE.NeutralToneMapping;
  return THREE.NoToneMapping;
}
