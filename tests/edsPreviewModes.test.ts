import { describe, expect, it } from 'vitest';
import {
  EDS_PREVIEW_FLAGS, EDS_PREVIEW_MODES, EDS_PREVIEW_TRIPLE_FLAGS,
  edsPreviewFlags, readEdsPreview, readEdsPreviewMode,
} from '../src/game/edsPreview';
import { League } from '../src/sim/League';

/**
 * EDS E4-PREP-2 (commander ruling #22.5) — the preview's reachable set.
 *
 * Round 2 puts a SECOND bundle in front of the user's eyes, and the thing that
 * has to be pinned is not "does the toggle work" but **which worlds the toggle
 * can build**. Every mode below is an arm a pre-registered audit actually ran;
 * anything else — the value axis without the perceived pair, above all — is a
 * combination nobody has measured, and a UI that can express it is a way to
 * ship an unaudited game by accident.
 */
describe('E4-PREP-2: only audited flag combinations are reachable', () => {
  it('the mode list is closed, and each mode is an audited arm', () => {
    expect([...EDS_PREVIEW_MODES]).toEqual(['off', 'v1', 'triple']);
    expect(edsPreviewFlags('off')).toEqual({});
    // v1: the pair that ships or reverts together (design contract §5).
    expect(edsPreviewFlags('v1')).toEqual({
      edsPerceivedChoice: true, edsPerceivedDefence: true,
    });
    // triple: the E5d Phase 1 audit's own arm, flag for flag.
    expect(edsPreviewFlags('triple')).toEqual({
      edsPerceivedChoice: true, edsPerceivedDefence: true, edsValueAxis: true,
    });
    expect(edsPreviewFlags('v1')).toEqual({ ...EDS_PREVIEW_FLAGS });
    expect(edsPreviewFlags('triple')).toEqual({ ...EDS_PREVIEW_TRIPLE_FLAGS });
  });

  it('NO mode arms the value axis without the perceived pair', () => {
    // The one combination that has never been audited. If a future edit ever
    // makes it expressible, this is the test that should stop it.
    for (const mode of EDS_PREVIEW_MODES) {
      const flags = edsPreviewFlags(mode);
      if (flags.edsValueAxis) {
        expect(flags.edsPerceivedChoice).toBe(true);
        expect(flags.edsPerceivedDefence).toBe(true);
      }
    }
  });

  it('no mode arms edsTouchCost or the trace — neither is in any live set', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      expect(edsPreviewFlags(mode).edsTouchCost).toBeUndefined();
      expect(edsPreviewFlags(mode).traceChoice).toBeUndefined();
    }
  });

  it('defaults OFF, all the way down to a real fixture', () => {
    expect(readEdsPreviewMode()).toBe('off');
    expect(readEdsPreview()).toBe(false);
    const league = new League({ seed: 20260726 });
    league.matchFlags = edsPreviewFlags(readEdsPreviewMode());
    expect(league.matchFlags).toEqual({});
    const fixture = league.nextFixture()!;
    const match = league.createMatch(fixture);
    expect(match.edsPerceivedChoice).toBe(false);
    expect(match.edsPerceivedDefence).toBe(false);
    expect(match.edsValueAxis).toBe(false);
    expect(match.edsTouchCost).toBe(false);
    expect(match.traceChoice).toBe(false);
  });

  it('each mode reaches the Match it claims to', () => {
    const league = new League({ seed: 20260726 });
    const fixture = league.nextFixture()!;
    const expected = {
      off: [false, false, false],
      v1: [true, true, false],
      triple: [true, true, true],
    } as const;
    for (const mode of EDS_PREVIEW_MODES) {
      league.matchFlags = edsPreviewFlags(mode);
      const match = league.createMatch(fixture);
      expect([match.edsPerceivedChoice, match.edsPerceivedDefence, match.edsValueAxis])
        .toEqual([...expected[mode]]);
      // Never, in any mode.
      expect(match.edsTouchCost).toBe(false);
    }
  });
});
