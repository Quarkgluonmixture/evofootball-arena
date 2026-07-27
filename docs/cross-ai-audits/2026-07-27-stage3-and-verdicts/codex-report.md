## Findings

1. **[A] P1’s identity control is impossible as currently defined.**

   **Claim:** The contract treats a station as a choice held for window `W`, yet the incumbent has no stored station choice: its target is recomputed from live state every frame. Freezing the incumbent’s current point will diverge as the world moves; recomputing it continuously no longer tests the force-target seam.

   **Evidence:** Q2 requires forcing a station target for `W` and demands bit-identical reproduction when forcing the incumbent target ([STAGE3-POSITIONING-EYE.md:140–149](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:140)). P0 subsequently establishes that station functions run at 60 Hz, store no target, and have no incumbent commitment cadence ([STAGE3-P0-CONSUMER-MAP.md:24–53](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-P0-CONSUMER-MAP.md:24)).

   **Severity / confidence:** design-blocking / high.

   **Action:** Define the intervention as a target *policy* in moving local coordinates, with target-error and time-to-reach mediators. Use an explicit “no override” arm for identity; do not call a frozen point “the incumbent target.”

2. **[A] The census estimates unilateral values but deploys them as a simultaneous policy.**

   **Claim:** P1 identifies one player’s station value while every other body retains the incumbent policy. P2 then gives the table to every outfielder on both teams. Density, offside structure, opponent response and station value are endogenous to adoption, so unilateral values need not survive universal consumption. Stability gates can detect collapse but cannot repair this identification failure.

   **Evidence:** The contract acknowledges that the census population law is “the incumbent policy of the other eleven bodies” ([STAGE3-POSITIONING-EYE.md:73–82](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:73)), but then deploys the eye symmetrically to both teams ([STAGE3-POSITIONING-EYE.md:194–199](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:194)). Q5 provides commitment and outcome gates, not an interference estimand ([STAGE3-POSITIONING-EYE.md:169–179](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:169)).

   **Severity / confidence:** design-blocking / high.

   **Action:** Add randomized adoption/saturation arms—one body, one line, one team, both teams—or perform policy iteration: deploy a mixture, recensus marginal values at that mixture, and repeat until tables and consumption stabilize.

3. **[A, easy to miss] The proposed “station seat” leaks into marking and restart control that the contract declares out of scope.**

   **Claim:** Replacing `formationSpot` does more than move a body. It changes zonal assignment centres, hence potentially who marks whom; it also changes `shapeReady`, kickoff placement, and support geometry. Consequently the intervention is not isolated to the declared station seat, and H-SHAPE cannot be attributed to the eye alone.

   **Evidence:** Marking assignments and the coach eye are explicitly out of v1 ([STAGE3-POSITIONING-EYE.md:120–127](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:120)). P0 finds that `formationSpot` drives zonal assignment and the restart gate, while `supportSpot` calls it internally ([STAGE3-P0-CONSUMER-MAP.md:68–98](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-P0-CONSUMER-MAP.md:68)). The live zonal assignment confirms this dependency ([TeamBrain.ts:477–499](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:477)).

   **Severity / confidence:** design-blocking / high.

   **Action:** Split the API into player movement, zonal-reference, support, and restart targets. Initially route only body movement through the eye and pin all other consumers bit-identically, or explicitly expand the causal scope and gate those downstream effects.

4. **[B] The treatment forces a multi-decision policy, not one choice.**

   **Claim:** HOLD-30/60/90 suppresses three to ten subsequent brain decisions and reasserts the action between decisions. It estimates “compulsory no-reconsideration hold for 0.5–1.5 seconds,” not the payoff of choosing to wait once and then responding to a newly matured run or pressure cue. This construction is predisposed to make waiting costly even when a one-decision wait would pay.

   **Evidence:** The arms impose fixed durations before returning control ([C5-T1-WAITING-CENSUS.md:70–90](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:70)); ordinary decisions occur every 0.15 seconds ([C5-T1-WAITING-CENSUS.md:55–68](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:55)). The forced branch returns at every decision ([PlayerBrain.ts:152–165](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:152)), and `Match` reasserts `ShieldHold` every frame ([Match.ts:798–813](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:798)).

   **Severity / confidence:** design-blocking / high.

   **Action:** Either force exactly one normal decision interval and then release all control, or formally make duration a live macro-action with the same commitment and cancellation rules that T2 would expose. Census those explicit choices separately.

5. **[B] The published fallback table does not implement its registered fallback ladder.**

   **Claim:** The code selects a `ladder` label but always computes rates from the sparse original cell. It never substitutes the pressure×stale, pressure, or marginal rows. The stored table therefore cannot safely price T2, and the programme’s unpark condition—whether any cell’s *interval* reaches zero—is not computable because cell CIs are absent.

   **Evidence:** The contract promises fallback estimates and calls the table usable ([C5-T1-WAITING-CENSUS.md:128–143](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:128)). In code, lines 323–326 choose the label, but line 329 still calls `rateOf(rows, arm)` on the raw cell ([c5-t1-waiting-census.ts:320–330](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c5-t1-waiting-census.ts:320)). Only 5/27 cells meet cell-level resolution ([C5-T1-WAITING-CENSUS.md:463–473](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:463)), while the programme requires a cell cost interval to reach zero ([PROGRAMME.md:2055–2062](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/PROGRAMME.md:2055)).

   **Severity / confidence:** design-blocking / high.

   **Action:** Rebuild each table row from the selected fallback population, emit cluster CIs and effective cluster counts, add tests tying `ladder`, `n`, rates and CIs to the same rows, then re-hash and re-run held-out calibration.

6. **[B] The hold capability acts on omniscient 60 Hz threat information.**

   **Claim:** `ShieldHold` turns away from the globally nearest true opponent every execution frame. That is neither the holder’s FOV-limited perception nor decaying memory, so the census does not measure a methodology-compliant capability.

   **Evidence:** The executor scans all true `opp.players`, selects the exact nearest body, and updates the heading and carry target ([actionExecutor.ts:433–466](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:433)). The project’s perception contract requires observer-local external evidence and forbids reading another body’s hidden truth ([VISION.md:82–112](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/VISION.md:82)).

   **Severity / confidence:** design-blocking / high.

   **Action:** Derive the threat from the holder’s pulled snapshot at scan/decision cadence, with explicit behavior for unseen or stale threats. Recensus after that change; the present negative may be conservative for survival, but it cannot certify the intended live mechanism.

7. **[C] “Resolved absence” and “exhausted” do not follow from the registered inferential semantics.**

   **Claim:** T2’s interval is inconclusive on sign. Its upper bound being below the experiment’s MDE refutes the predicted +5.7 pp effect, but an MDE is a power characteristic, not a practical-equivalence margin. Moreover neither T1’s Phase B nor the coupled pair audit/fresh evolution ran, so the selection and ecology layers were never tested.

   **Evidence:** D1 is `+0.41pp`, CI `[-0.65,+1.46]`; the document itself notes that the interval straddles zero but calls it a resolved absence because `1.46 < 2.32 MDE` ([C4-T2-ARRIVAL.md:456–477](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T2-ARRIVAL.md:456)). Binding semantics say such an interval is inconclusive and flatness requires a pre-registered equivalence band ([PROBE-CONTRACTS.md:63–76](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/PROBE-CONTRACTS.md:63), [PROBE-CONTRACTS.md:133–140](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/PROBE-CONTRACTS.md:133)). T1 Phase B stopped ([C4-T1-FLIGHT.md:478–487](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T1-FLIGHT.md:478)), and T2 delegates the pair audit to a future contract ([C4-T2-ARRIVAL.md:362–367](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T2-ARRIVAL.md:362)), yet the programme closes C4 entirely ([PROGRAMME.md:1546–1580](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/PROGRAMME.md:1546)).

   **Severity / confidence:** design-blocking for the “exhausted” verdict / high.

   **Action:** Record the defensible result: “this specific reroute failed to deliver the predicted magnitude; effects above +1.46 pp are excluded under this estimator.” Pre-register a genuine smallest-effect-of-interest before claiming equivalence, and require the selection/ecology layers before declaring the avenue exhausted.

8. **[C] T1 tested blanket lofting, not a selectable flight capability.**

   **Claim:** Every cross receives the headable-flight floor for an entire match. That is a policy mandate, not fork-and-force of one flight choice, and it can be harmful on average even if lofting pays in identifiable contexts. Per-cross arms also contain different cross populations, so conditioning on “a cross occurred” is post-treatment selection.

   **Evidence:** The contract itself derives that the existing flight law is not broken—the archetype gap is a distance gap and the cross trigger is a second seat ([C4-T1-FLIGHT.md:65–71](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T1-FLIGHT.md:65))—but then floors all crosses ([C4-T1-FLIGHT.md:73–86](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T1-FLIGHT.md:73)). The three arms produce 5,547/5,633/5,548 crosses ([C4-T1-FLIGHT.md:359–363](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T1-FLIGHT.md:359)); T2 likewise compares 5,745/5,637/5,632 treatment-dependent deliveries ([C4-T2-ARRIVAL.md:428–432](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T2-ARRIVAL.md:428)).

   **Severity / confidence:** design-blocking for the causal conclusion / high.

   **Action:** At the same real cross moment, fork and force exactly one profile—current/driven versus lofted—then let the world play. Census the payoff by pre-kick perceived context and expose profiles as candidates. This is the cheapest methodology-compliant intervention the programme overlooked.

9. **[B, easy to miss] The concession and release-origin diagnostics use different clocks from their stated estimands.**

   **Claim:** Hold arms run for `holdTicks + HORIZON`. Attacking shots are frozen at `HORIZON`, but concessions are read only after the longer simulation, mechanically giving longer holds more time to concede. The “release” twin begins at nominal force expiry even if the holder lost possession and even if no release occurred.

   **Evidence:** The contract says concessions use the same window ([C5-T1-WAITING-CENSUS.md:92–115](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:92)) and defines an actual release-origin twin ([C5-T1-WAITING-CENSUS.md:297–304](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:297)). The probe freezes `shot` at elapsed 240 but reads `conceded` after up to 240+k ticks ([c5-t1-waiting-census.ts:159–189](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c5-t1-waiting-census.ts:159)). It snapshots at `elapsed === holdTicks` and includes every non-null nominal-expiry row in the release comparison ([c5-t1-waiting-census.ts:167–197](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c5-t1-waiting-census.ts:167), [c5-t1-waiting-census.ts:393–399](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c5-t1-waiting-census.ts:393)).

   **Severity / confidence:** material / high.

   **Action:** Recompute concessions at elapsed 240 in all arms. Define release as the original holder’s actual kick event; exclude or separately classify losses and continuing possession. Withdraw “expensive at both ends” and “the twin closes the defence” until rerun. The primary shot estimate is not affected by this particular bug.

10. **[C, easy to miss] “Goal within four seconds” is not what the probes calculate.**

   **Claim:** Both probes find the first completed shot and mark the row a goal only if that first shot scored. A miss followed by a goal is recorded as no goal. Windows also close early at the next cross, causing treatment-dependent censoring.

   **Evidence:** T1 uses `shotLog.find(...)` and `goal: s?.outcome === 'goal'` ([c4-t1-flight.ts:300–323](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c4-t1-flight.ts:300)); an open window is closed on the next cross rather than after four seconds ([c4-t1-flight.ts:447–495](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c4-t1-flight.ts:447)). T2 repeats the first-shot implementation ([c4-t2-arrival.ts:244–279](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c4-t2-arrival.ts:244)). This is the statistic behind the claimed resolved goal decrease ([C4-T1-FLIGHT.md:422–432](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T1-FLIGHT.md:422)).

   **Severity / confidence:** material / high.

   **Action:** Record whether *any* goal event occurs during a complete fixed horizon, permitting overlapping cross windows, or explicitly rename the estimand “first-shot outcome before next cross.” Until corrected, “fewer goals” is unsupported; the launch-height and contest-share findings remain separately credible.

11. **[A] P1 lacks a demonstrated attainable signal and an explicit treatment-adherence model.**

   **Claim:** A one-player station change has a small effect on rare score/concede events, yet P1 multiplies candidate lattice points by context cells and a longer horizon. Candidate value also depends strongly on current distance, speed, role and orientation; the illustrative feature set omits them. Without reach/ETA mediators, the table conflates a bad location with failure to arrive there.

   **Evidence:** P1 proposes score/concede outcomes for every lattice candidate ([STAGE3-POSITIONING-EYE.md:98–116](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:98)) and only postpones reachability and horizon specification to its future pre-registration ([STAGE3-POSITIONING-EYE.md:140–149](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:140)). Its illustrative cell is zone×threat×face×density×offside ([STAGE3-POSITIONING-EYE.md:215–222](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:215)), whereas VISION requires self capability and dynamics in value ([VISION.md:94–103](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/VISION.md:94)).

   **Severity / confidence:** material / high.

   **Action:** Before freezing P1, power a positive-control displacement, estimate required match/runtime per effective cell, and require ETA, target-error and occupancy-time mediators. Include perceived self/role/ETA features or narrow the sampled population accordingly. If score/concede is unattainably sparse, use a separately censused next-state value axis with score/concede as validation.

12. **[A] Reusing existing tactical genes does not preserve their meaning or isolate H-SHAPE.**

   **Claim:** The six proposed genes already control pressing, width, compactness, support distance and rest defence elsewhere. Mapping them again to score/concede face weights creates two causal paths and possible double payment; serialized populations are therefore not automatically comparable. Legacy modes and licences can also generate attack/defence shape differences, so H-SHAPE is not an attribution test.

   **Evidence:** The contract promises no new genes and unchanged meanings ([STAGE3-POSITIONING-EYE.md:180–186](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:180)), while their existing meanings are explicit in the genome ([genome.ts:16–37](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/genome.ts:16), [genome.ts:90–101](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/genome.ts:90)). Coach modes and licences remain legacy ([STAGE3-POSITIONING-EYE.md:120–123](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:120)), yet P3 asks whether shape difference emerges without a mode table ([STAGE3-POSITIONING-EYE.md:228–236](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/STAGE3-POSITIONING-EYE.md:228)); the incumbent mode shifts are literal constants ([formations.ts:115–123](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/formations.ts:115)).

   **Severity / confidence:** material / high.

   **Action:** Freeze an explicit mapping and run gene→mediator path ablations. Remove or budget the old use before assigning a new meaning, or introduce separately budgeted preference genes. For H-SHAPE, include a mode/licence ablation or weaken the claim to observed shape difference under the combined policy.

13. **[B] The strong marginal result does not establish that no conditional hold state exists.**

   **Claim:** A0 is the naturally selected best action—including immediate shots—while hold is forced at every generic ownership decision. No discrimination gate was required, most detailed cells are sparse, and the certification gate failed on A0. The credible result is therefore a large negative average for blanket compulsory holds in the build block, not “a priced chooser would essentially never hold.”

   **Evidence:** A0 includes pass, carry and shoot ([C5-T1-WAITING-CENSUS.md:70–82](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:70)); discrimination across cells was explicitly ungated ([C5-T1-WAITING-CENSUS.md:179–185](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:179)). Only 5 cells attained full resolution, while 22 required a fallback ([C5-T1-WAITING-CENSUS.md:463–473](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:463)). H1 failed because act-now shifted 2.99 pp across blocks ([C5-T1-WAITING-CENSUS.md:343–383](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C5-T1-WAITING-CENSUS.md:343)); the binding methodology now explicitly records that gate as knowingly mis-powered ([PROBE-CONTRACTS.md:142–154](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/PROBE-CONTRACTS.md:142)).

   **Severity / confidence:** material / high.

   **Action:** Recensus at pre-defined *eligible-choice* moments—excluding immediate-shot dominance, or keying on the live action-margin/menu state—and require held-out conditional discrimination with multiplicity control. Preserve the current result as evidence against universal forced holding.

14. **[C] T2 tests one omniscient scripted reroute; it does not isolate perception as the remaining cause.**

   **Claim:** The executor centrally chooses the closest licensed body from true positions and exact landing every frame. It moves only one body, while the documents explicitly leave a large-randomness, instantaneous contest model untouched. Failure of this script neither exhausts a second-body marginal intervention nor distinguishes arrival perception from contest physics.

   **Evidence:** The true-world closest-body scan and exact landing target are in the executor ([actionExecutor.ts:314–337](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:314)). T2 finds that the closest body was usually already receiving or chasing and explicitly names “aim more than one body” as the obvious re-pose ([C4-T2-ARRIVAL.md:479–517](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T2-ARRIVAL.md:479), [C4-T2-ARRIVAL.md:588–591](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T2-ARRIVAL.md:588)). The parent contract defers contest time and a random term as large as the skill terms ([C4-AERIAL-ARRIVAL.md:68–78](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-AERIAL-ARRIVAL.md:68)); live resolution contains the hard-coded `+0.3` and `rng(0,0.45)` ([mechanics.ts:804–833](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:804)).

   **Severity / confidence:** material / high.

   **Action:** Run a cheap offline fork at the same H3 crosses: force one additional already-licensed non-receiver’s station target toward the descent, then release the sim. Separately census forced jump/contest choices. These remain methodology-compliant oracles; only a later perceived selector should ship.

15. **[C] Cross-combination clustering is underspecified.**

   **Claim:** The same numeric seed block is reused for each archetype×shell combination, but cluster IDs are offset so those common-random-number streams are resampled independently. If cross-combination correlations are positive, intervals are too narrow; at minimum, “cluster unit = match seed” is not an exact description of the implemented unit.

   **Evidence:** T1 declares match seed as the cluster ([C4-T1-FLIGHT.md:134–147](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/C4-T1-FLIGHT.md:134)), while code calls every combination with the same `seedStart` and offsets the IDs ([c4-t1-flight.ts:735–749](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c4-t1-flight.ts:735)). T2 repeats the pattern ([c4-t2-arrival.ts:553–569](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/c4-t2-arrival.ts:553)).

   **Severity / confidence:** minor / medium.

   **Action:** Report a sensitivity bootstrap clustering all combinations by numeric seed versus `(combination, seed)`. Then name the chosen experimental unit precisely.

## Overall verdicts

**Audit (a):** The positioning-eye direction is strongly aligned with the house methodology—measured components, private perception, causal forks, and no hand-weighted spatial score—but the P1–P3 contract is not ready to execute. The intervention is not presently well-defined against a continuously moving incumbent target, its consumer boundary leaks into marking and restarts, and unilateral prices are proposed for simultaneous universal consumption. I would approve further P0/P1 feasibility work only after those three issues are rewritten; I would not approve the current P1 census as a shipping-value table.

**Audit (b):** The primary data credibly show that compulsorily shielding for 0.5–1.5 seconds at generic ownership moments substantially reduces the probability of a shot within four seconds in the build population. They do not establish that a one-decision wait never pays, that no conditional cell pays, or that a T2 chooser would never hold. The saved table’s fallback is misimplemented, its required cell intervals do not exist, the release/concession corroboration is invalid, and the action is omniscient. Parking a universal fixed-duration hold is reasonable; parking the entire “whether to wait” seat on this evidence is not.

**Audit (c):** The mechanical findings are useful and mostly convincing: the flight floor raises balls into the band, contests rise mainly for defenders, and the licence-survival defect is real but has little physical effect. “Aerial arrival exhausted; residual belongs to perception” is nevertheless unsupported. The goal estimator is wrong, the arrival CI is inconclusive rather than equivalent, selection and the coupled live audit never ran, blanket lofting was tested instead of selectable flight, and only one already-redundant reroute was tried. A cross-moment flight-profile census and an additional-body station fork are cheap, compliant next tests before closing C4.