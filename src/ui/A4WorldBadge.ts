/**
 * THE A4 WORLD BADGE (commander ruling #155.2.iii) — "the user must know which
 * world they are watching".
 *
 * A play-test that leaves any doubt about which world produced the football on
 * screen is worthless, and the entry is sticky across reloads, so the reminder
 * has to be PERSISTENT rather than a one-off feed line. It is a chip in the
 * `.mode-badge` family, fixed to the viewport under the safe-area inset (the
 * `.pwa-update` idiom) so it survives the phone's stacked layout and every
 * full-screen overlay, and it is `pointer-events: none` like the build badge —
 * it can never eat a tap.
 *
 * Mounted ONLY while armed: with the entry off the element does not exist. With
 * SEVERAL experimental worlds (#167.5, #184.2) the chip also names WHICH one is
 * armed.
 *
 * The DOM is injected (the `WakeLockEnv` idiom) so the mount/unmount contract
 * is testable in the node suite.
 */

import type { A4WorldVersion } from '../game/a4World';

export interface BadgeElement {
  className: string;
  textContent: string | null;
  remove(): void;
}

export interface BadgeDoc {
  createElement(tag: string): BadgeElement;
  readonly body: { appendChild(node: BadgeElement): void };
}

export const A4_BADGE_CLASS = 'a4-world-badge';
/** Plain-language, in the user's own words for the world (#152 amendment). */
export const A4_BADGE_TEXT = '🧪 A4 约定世界 v1 · 统一';
/**
 * ⭐ V2 (#167.5): the badge must DISTINGUISH the two worlds — with two play-test
 * worlds available the old undifferentiated chip would leave the user guessing
 * which football they are watching, which is exactly what the badge exists to
 * prevent. Each world names itself: v1 = one whisper for everyone, v2 = 纪律
 * (per-position tightness).
 */
export const A4_BADGE_TEXT_V2 = '🧪 A4 约定世界 v2 · 纪律';
/**
 * ⭐ V3 (#184.2): v2's world plus the short-pass wind-up. The chip names the ONE
 * thing that looks different on screen — 前摇 (the leg goes back before the ball
 * goes) — so the user can never mistake a v3 match for a v2 one.
 */
export const A4_BADGE_TEXT_V3 = '🧪 A4 约定世界 v3 · 前摇';
/**
 * ⭐ V4/V5 (#211.3) — the MT play-test worlds. These are NOT A4 worlds, and the chip
 * says so: a different family name (MT), and the DOSE in the name, because the whole
 * point of the pair is that the user can tell 0.2 from 0.8 at a glance while switching
 * between them. 0.2 is the ruled knee (the default-named world), 0.8 the contrast.
 */
export const A4_BADGE_TEXT_MT02 = '🧪 MT 0.2 · 松盯内收';
export const A4_BADGE_TEXT_MT08 = '🧪 MT 0.8 · 松盯内收(对比)';
/**
 * ⭐ V6 (#269.4) — the CB 过人 world, a THIRD family. The chip names the family, the thing the
 * eye is being asked about (过人), and the DOSE, because the carry-proneness dose is a declared
 * PRESENTATION choice the user is judging at this gate — a chip that hid it would let the world
 * be mistaken for a settled one.
 */
export const A4_BADGE_TEXT_CB = '🧪 CB 过人世界 · 剂量 1.0';
/** version ⇒ chip text (0 = no chip). */
export const A4_BADGE_TEXTS: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
  1: A4_BADGE_TEXT, 2: A4_BADGE_TEXT_V2, 3: A4_BADGE_TEXT_V3,
  4: A4_BADGE_TEXT_MT02, 5: A4_BADGE_TEXT_MT08, 6: A4_BADGE_TEXT_CB,
};

const defaultDoc = (): BadgeDoc | null =>
  (typeof document === 'undefined' ? null : (document as unknown as BadgeDoc));

export class A4WorldBadge {
  private el: BadgeElement | null = null;
  private version: A4WorldVersion = 0;

  constructor(private readonly doc: BadgeDoc | null = defaultDoc()) {}

  /** Is the chip currently in the document? (the test surface) */
  get mounted(): boolean {
    return this.el !== null;
  }

  /** Which world the chip currently names (0 = none). */
  get world(): A4WorldVersion {
    return this.el === null ? 0 : this.version;
  }

  /** Name the armed world — 0 removes the chip, 1…6 mount or RELABEL it in place. */
  setWorld(version: A4WorldVersion): void {
    if (version === this.world) return;
    this.version = version;
    if (version === 0) {
      this.el?.remove();
      this.el = null;
      return;
    }
    if (this.el !== null) { // switching worlds: one chip, new name
      this.el.textContent = A4_BADGE_TEXTS[version];
      return;
    }
    if (this.doc === null) return; // headless: nothing to paint on
    const chip = this.doc.createElement('div');
    chip.className = A4_BADGE_CLASS;
    chip.textContent = A4_BADGE_TEXTS[version];
    this.doc.body.appendChild(chip);
    this.el = chip;
  }
}
