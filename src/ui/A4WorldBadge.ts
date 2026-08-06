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
 * Mounted ONLY while armed: with the entry off the element does not exist.
 *
 * The DOM is injected (the `WakeLockEnv` idiom) so the mount/unmount contract
 * is testable in the node suite.
 */

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
export const A4_BADGE_TEXT = '🧪 A4 约定世界';

const defaultDoc = (): BadgeDoc | null =>
  (typeof document === 'undefined' ? null : (document as unknown as BadgeDoc));

export class A4WorldBadge {
  private el: BadgeElement | null = null;

  constructor(private readonly doc: BadgeDoc | null = defaultDoc()) {}

  /** Is the chip currently in the document? (the test surface) */
  get mounted(): boolean {
    return this.el !== null;
  }

  setArmed(armed: boolean): void {
    if (armed === this.mounted) return;
    if (!armed) {
      this.el?.remove();
      this.el = null;
      return;
    }
    if (this.doc === null) return; // headless: nothing to paint on
    const chip = this.doc.createElement('div');
    chip.className = A4_BADGE_CLASS;
    chip.textContent = A4_BADGE_TEXT;
    this.doc.body.appendChild(chip);
    this.el = chip;
  }
}
