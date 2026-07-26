/**
 * EDS E4-PREP (commander ruling #14.3) — the v1 bundle as a player-facing
 * PREVIEW switch.
 *
 * The two live flags exist only as `Match` construction config, and the user
 * plays the deployed build, so the play-test needs a way to arm them from inside
 * the game. This module owns that choice: the flag pair, its storage key and its
 * default. It deliberately imports nothing — the default-off pin should not have
 * to load a renderer to check a default.
 *
 * OFF unless the user explicitly turned it on. Everything in this bundle has
 * passed its probes and none of it has passed the user's eyes.
 */

export const EDS_PREVIEW_KEY = 'evo:edsPreview';

/**
 * The two v1 live flags, together. They ship or revert as ONE bundle (design
 * contract §5), and the E3/E3R ablations are why: the chooser alone costs 21.69%
 * of the goals, and the perceived defender is what brings the equilibrium back
 * (+2.20%). `edsTouchCost` is deliberately absent — ruling #12.3 took it out of
 * the v1 live set.
 */
export const EDS_PREVIEW_FLAGS = {
  edsPerceivedChoice: true,
  edsPerceivedDefence: true,
} as const;

/** The user's sticky choice, defaulting OFF on anything unexpected. */
export function readEdsPreview(): boolean {
  try {
    return localStorage.getItem(EDS_PREVIEW_KEY) === '1';
  } catch {
    return false; // private mode / no storage
  }
}

export function writeEdsPreview(on: boolean): void {
  try {
    localStorage.setItem(EDS_PREVIEW_KEY, on ? '1' : '0');
  } catch { /* the choice still applies for this session */ }
}
