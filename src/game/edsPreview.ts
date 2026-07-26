/**
 * EDS E4-PREP (commander ruling #14.3) — the v1 bundle as a player-facing
 * PREVIEW switch, extended to the audited TRIPLE by ruling #22.5.
 *
 * The live flags exist only as `Match` construction config, and the user plays
 * the deployed build, so the play-test needs a way to arm them from inside the
 * game. This module owns that choice: the reachable MODES, their flag sets, the
 * storage key and the default. It deliberately imports nothing — the default-off
 * pin should not have to load a renderer to check a default.
 *
 * OFF unless the user explicitly turned it on. Everything here has passed its
 * probes and none of it has passed the user's eyes.
 *
 * **The reachable set is a closed list of AUDITED combinations.** Every mode
 * below is an arm some pre-registered audit actually ran; nothing else can be
 * expressed, which is why this is a mode rather than a bag of independent
 * checkboxes. `edsValueAxis` alone, in particular, has never been audited and
 * must not be reachable.
 */

export const EDS_PREVIEW_KEY = 'evo:edsPreview';

/** The closed list. Order is the UI's order: no bundle, then bundles. */
export const EDS_PREVIEW_MODES = ['off', 'v1', 'triple'] as const;
export type EdsPreviewMode = typeof EDS_PREVIEW_MODES[number];

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

/**
 * The v1 pair plus the measured attempt-value axis — **the E5d Phase 1 audit's
 * own arm**, not a combination invented for the UI. That audit produced the
 * tightest §2 band of the slice (goals −0.07%), forward share ABOVE flags-off
 * for the first time and shots +22%, and it fired on both combination counters.
 * Ruling #22.5 puts it in front of the user's eyes for round 2 precisely because
 * the probes disagree with each other and only the user can break the tie.
 */
export const EDS_PREVIEW_TRIPLE_FLAGS = {
  edsPerceivedChoice: true,
  edsPerceivedDefence: true,
  edsValueAxis: true,
} as const;

/** The flags a mode arms — the ONLY way to turn a mode into flags. */
export function edsPreviewFlags(mode: EdsPreviewMode): Record<string, boolean> {
  if (mode === 'v1') return { ...EDS_PREVIEW_FLAGS };
  if (mode === 'triple') return { ...EDS_PREVIEW_TRIPLE_FLAGS };
  return {};
}

const isMode = (value: string | null): value is EdsPreviewMode =>
  (EDS_PREVIEW_MODES as readonly string[]).includes(value ?? '');

/**
 * The user's sticky choice, defaulting OFF on anything unexpected.
 *
 * `'1'` is E4-PREP's own stored value and still means the v1 pair, so a user who
 * armed the preview before this ruling keeps exactly the bundle they armed.
 */
export function readEdsPreviewMode(): EdsPreviewMode {
  try {
    const raw = localStorage.getItem(EDS_PREVIEW_KEY);
    if (raw === '1') return 'v1';
    return isMode(raw) ? raw : 'off';
  } catch {
    return 'off'; // private mode / no storage
  }
}

export function writeEdsPreviewMode(mode: EdsPreviewMode): void {
  try {
    localStorage.setItem(EDS_PREVIEW_KEY, mode);
  } catch { /* the choice still applies for this session */ }
}

/** Is any preview bundle armed? (E4-PREP's boolean, kept for its own pin.) */
export function readEdsPreview(): boolean {
  return readEdsPreviewMode() !== 'off';
}
