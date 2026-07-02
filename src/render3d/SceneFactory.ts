import * as THREE from 'three';
import { HALF_L, HALF_W } from '../sim/constants';

/**
 * Scene, lights and atmosphere for the diorama-style pitch. No stadium —
 * a clean floating pitch on a dark backdrop matching the app theme.
 */
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1220);
  scene.fog = new THREE.Fog(0x0b1220, 160, 320);

  const hemi = new THREE.HemisphereLight(0xbdd4ff, 0x1c2b1e, 1.05);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff2df, 2.2);
  sun.position.set(-40, 70, 30);
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

  // Dark pedestal under the pitch so the diorama reads as a solid object.
  const pedestal = new THREE.Mesh(
    new THREE.BoxGeometry(HALF_L * 2 + 14, 2.5, HALF_W * 2 + 14),
    new THREE.MeshStandardMaterial({ color: 0x111a2c, roughness: 0.95 }),
  );
  pedestal.position.y = -1.3;
  pedestal.receiveShadow = true;
  scene.add(pedestal);

  return scene;
}
