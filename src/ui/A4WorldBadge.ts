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
/**
 * ⭐ V7 (#282.4) — the CB world PLUS the defence book. The chip names both halves and the DOSE
 * FORM, because world 7 ships two forms of one world (`?l3dose=0`) and they are the two arms
 * L3-T2 measured separately: 剂量成熟 = the book that has fully learned (arm C), 空账本 = the
 * shipped law's own season-one state (arm B). A chip that hid which one is on screen would let
 * the gate's answer be given about the wrong world.
 */
export const A4_BADGE_TEXT_L3 = '🧪 CB+防守账本 · 剂量成熟';
export const A4_BADGE_TEXT_L3_EMPTY = '🧪 CB+防守账本 · 空账本';
/**
 * ⭐ V8 (#300 item 6) — world 7 PLUS the reaction-latency door. The chip names all three halves
 * and the DOSE FORM, for the same reason v7's does: world 8 ships two forms of one world
 * (`?pcdose=0`) and they are the two arms PC-T2 measured separately — 剂量成熟 = the books that
 * have lived a season (arm `v7pcMatured`), 空账本 = everyone a novice (arm `v7pcEmpty`, the
 * WILDEST of the two). A chip that hid which one is on screen would let the gate's answer be
 * given about the wrong world.
 */
export const A4_BADGE_TEXT_PC = '🧪 CB+账本+反应延迟 · 剂量成熟';
export const A4_BADGE_TEXT_PC_EMPTY = '🧪 CB+账本+反应延迟 · 空账本(全新手)';
/**
 * ⭐ V9 (#309 item 5) — world 8 PLUS the two BK body laws. The chip names the thing the eye is
 * being asked about (身体诚实) and, like worlds 7 and 8, the DOSE FORM, because world 9 inherits
 * world 8's `?pcdose=0` contrast unchanged (it IS the world-8 arming path, called).
 *
 * ⚠ THE COST DOES NOT LIVE HERE. A chip is a few characters on a phone; the honest price
 * (传球更难了 — BK-T2's −8.9 pp) is carried by the blurb and the feed line, which is where a
 * player can actually read it (ruling #309 item 5: the blurb CARRIES THE COST).
 */
export const A4_BADGE_TEXT_BK = '🧪 身体诚实的世界 · 剂量成熟';
export const A4_BADGE_TEXT_BK_EMPTY = '🧪 身体诚实的世界 · 空账本(全新手)';
/**
 * ⭐ V10 (#337 item 5) — world 9 PLUS the DF brain, THE CAP INTACT. The chip names the thing the
 * eye is being asked about (会思考的防守) and, like worlds 7/8/9, the DOSE FORM, because world 10
 * inherits world 8's `?pcdose=0` contrast unchanged (it IS the world-9 arming path, called).
 *
 * ⚠ THE HONEST STATE DOES NOT LIVE HERE. A chip is a few characters on a phone; that the
 * Phase-31 cap STAYS — with DF-T4's measured receipt for why — is carried by the blurb and the
 * feed line, which is where a player can actually read it.
 */
export const A4_BADGE_TEXT_DF = '🧪 会思考的防守 · 剂量成熟';
export const A4_BADGE_TEXT_DF_EMPTY = '🧪 会思考的防守 · 空账本(全新手)';
/**
 * ⭐ V11 (#337 item 5) — world 10 PLUS the corridor price at rung 0.5. The chip names the thing
 * the eye is being asked about (门将不再往人身上开球), the WEIGHT (0.5 is a declared presentation
 * choice the user is judging at this gate, the #269.4 form) and the dose form.
 *
 * ⚠ THE COST DOES NOT LIVE HERE either: that the lofted game is played LESS, and that the
 * corridor × DF-brain composition has never been measured together, are blurb and feed-line
 * business.
 */
export const A4_BADGE_TEXT_CR = '🧪 门将不再往人身上开球 · 权重 0.5';
export const A4_BADGE_TEXT_CR_EMPTY = '🧪 门将不再往人身上开球 · 权重 0.5 · 空账本(全新手)';
/**
 * ⭐ V12 (#364 item 3 / #365) — world 11 PLUS the five delivery/access doors at the RA-T1B
 * exam pins. The chip names the thing the eye is being asked about (传球先问「他赶得到吗」)
 * and the dose form.
 *
 * ⚠ THE COST DOES NOT LIVE HERE either: that the world plays FEWER passes and MORE carries
 * (~2 ground passes/match thinner), and that the DOSED-book composition is this entry's
 * first look (the exams ran the empty-book form), are blurb and feed-line business.
 */
export const A4_BADGE_TEXT_RA = '🧪 传球先问赶不赶得到 · 价格 1.0';
export const A4_BADGE_TEXT_RA_EMPTY = '🧪 传球先问赶不赶得到 · 价格 1.0 · 空账本(全新手)';
/** version ⇒ chip text (0 = no chip). The world-7…12 defaults are the DOSED forms. */
export const A4_BADGE_TEXTS:
Readonly<Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, string>> = {
  1: A4_BADGE_TEXT, 2: A4_BADGE_TEXT_V2, 3: A4_BADGE_TEXT_V3,
  4: A4_BADGE_TEXT_MT02, 5: A4_BADGE_TEXT_MT08, 6: A4_BADGE_TEXT_CB,
  7: A4_BADGE_TEXT_L3, 8: A4_BADGE_TEXT_PC, 9: A4_BADGE_TEXT_BK,
  10: A4_BADGE_TEXT_DF, 11: A4_BADGE_TEXT_CR, 12: A4_BADGE_TEXT_RA,
};
/**
 * ⭐ version ⇒ the chip text for the `?pcdose=0` EMPTY form (the PC stack's inherited contrast).
 * ONE table instead of a chain of ternaries in the app, so a new world of this family cannot
 * silently fall back to a LOWER world's chip while the badge claims to name the world on screen
 * (the #282.4 form: the chip names the world AND the dose form).
 */
export const A4_BADGE_TEXTS_EMPTY: Readonly<Partial<Record<A4WorldVersion, string>>> = {
  8: A4_BADGE_TEXT_PC_EMPTY, 9: A4_BADGE_TEXT_BK_EMPTY,
  10: A4_BADGE_TEXT_DF_EMPTY, 11: A4_BADGE_TEXT_CR_EMPTY, 12: A4_BADGE_TEXT_RA_EMPTY,
};

const defaultDoc = (): BadgeDoc | null =>
  (typeof document === 'undefined' ? null : (document as unknown as BadgeDoc));

export class A4WorldBadge {
  private el: BadgeElement | null = null;
  private version: A4WorldVersion = 0;
  private text = '';

  constructor(private readonly doc: BadgeDoc | null = defaultDoc()) {}

  /** Is the chip currently in the document? (the test surface) */
  get mounted(): boolean {
    return this.el !== null;
  }

  /** Which world the chip currently names (0 = none). */
  get world(): A4WorldVersion {
    return this.el === null ? 0 : this.version;
  }

  /** What the chip currently says ('' when there is no chip) — the test surface. */
  get label(): string {
    return this.el === null ? '' : this.text;
  }

  /**
   * Name the armed world — 0 removes the chip, 1…12 mount or RELABEL it in place.
   *
   * ⭐ `textOverride` (#282.4) exists for ONE reason: world 7 ships two FORMS of one world (the
   * matured dose and the `?l3dose=0` empty book), and they are the two arms L3-T2 measured
   * separately. It names a form of the version passed, never a different version — the version
   * remains the single value the whole family is keyed on.
   */
  setWorld(version: A4WorldVersion, textOverride?: string): void {
    const label = version === 0 ? '' : textOverride ?? A4_BADGE_TEXTS[version];
    if (version === this.world && label === this.label) return;
    this.version = version;
    this.text = label;
    if (version === 0) {
      this.el?.remove();
      this.el = null;
      return;
    }
    if (this.el !== null) { // switching worlds: one chip, new name
      this.el.textContent = label;
      return;
    }
    if (this.doc === null) return; // headless: nothing to paint on
    const chip = this.doc.createElement('div');
    chip.className = A4_BADGE_CLASS;
    chip.textContent = label;
    this.doc.body.appendChild(chip);
    this.el = chip;
  }
}
