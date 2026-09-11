# EvoFootball — Evolution Discovery / Explainability Contract

> Registered 2026-09-11. This document operationalizes existing `docs/VISION.md` emergence rules, `docs/PROBE-CONTRACTS.md` causal discipline, and `docs/UI-NORTHSTAR.md`'s “世界观测台 + 演化纪录片 + 可交互实验室” direction.
>
> It is **not** a new live-programme phase and does not authorize sim changes. Current execution still follows `docs/world-model/PROGRAMME.md`. This contract becomes binding when behaviour-discovery / causal-replay / evolution-documentary work is explicitly opened.

---

## 0. The problem

EvoFootball does not need a classifier that says “this clip looks like an overlap”. It needs a scientific instrument that can discover **previously unnamed, repeatedly useful football relationships** and explain how they appeared through evolution.

The key distinctions are binding:

1. **surface form ≠ causal function** — two similar-looking runs can serve different functions; two visually different patterns can create the same tactical effect.
2. **effect ≠ intent** — a run may open space without the runner having selected it *in order to* open that space.
3. **mechanism ≠ evolved mechanism** — a causal interaction is not an evolutionary discovery until its birth, retention, inheritance/adaptation and ecological use are traced.
4. **code rationale ≠ behavioural explanation** — a utility-score trace explains a local choice computation, not why a multi-player convention/tactic exists across seasons.

This extends the existing rule **“有故事就要有探针”**: the system should first discover a candidate structure, then earn each stronger interpretation with increasingly discriminating evidence.

---

## 1. Discovery object

Represent a candidate evolved football structure as:

```text
M = (C, F, R, Δ, L, E)
```

- **C — context**: game state, possession, legal observations, score/time, shape, opponent situation.
- **F — form**: multi-player temporal/spatial pattern — positions, velocities, facing, touches, passes, runs, pressure, ball trajectory.
- **R — response**: how teammates/opponents alter motion, marking, spacing, options or decisions.
- **Δ — causal function**: what changes under paired counterfactual intervention.
- **L — lineage**: first appearance, stabilization, inheritance, coach/player movement, drift, independent rediscovery, extinction.
- **E — ecology**: against which opponent structures it pays; what counters it; whether its payoff changes as it spreads.

Human tactical names (`内切`, `套边`, `第三人`, `二过一`, `高位压迫`...) are **candidate interpretations of M**, never the discovery primitive.

---

## 2. Why football requires two representation spaces

### 2.1 Form space — what it looks like

A discovery engine may learn/mine multi-timescale relational motifs from:

- ball and player positions/velocities/facing;
- possession/control/touch events;
- pass/run/shot/duel transitions;
- team shape and local neighbourhood relations;
- legal perception / gaze / private-observation state once those authorities are live.

Timescales should range from sub-second body/ball actions through 1–5 s combinations, possession phases and whole attacks.

### 2.2 Function space — what it changes

A second representation should characterize consequences such as:

- defender displacement;
- teammate space created/lost;
- future option count;
- line breaks;
- pitch-control / local numerical advantage;
- possession retention / turnover exposure;
- progression / xG / chance creation;
- future multi-agent state distribution.

Human-readable metrics are useful, but not exhaustive. Preserve a learned future-state / effect representation so the system can discover:

- **different forms, same function**;
- **same form, different function**.

Example:

Two “winger cuts inside” can look nearly identical. One may mainly improve the carrier's shot angle; another may primarily drag the fullback inward and create an overlap lane. Trajectory clustering alone must not collapse them.

---

## 3. Claim ladder

Do not produce one `noveltyScore` or `tacticConfidence` and optimize/interpret it as truth.

### Level 0 — anomaly

A behaviour segment differs from the club/player's history or population baseline.

### Level 1 — recurring motif

The structure repeats across multiple possessions/matches under non-identical circumstances.

### Level 2 — conditional pattern

Expression is selective: the behaviour appears under identifiable game/information contexts rather than as random choreography.

### Level 3 — relational coordination

Other players systematically alter behaviour around it after common-cause controls are considered.

### Level 4 — causal mechanism

Paired counterfactual branches demonstrate that changing a component changes downstream state in the predicted direction.

### Level 5 — evolution-selected mechanism

Fresh evolution retains/rediscovers the mechanism in at least some ecologies at a real opportunity cost.

### Level 6 — evolved tactical structure / convention

It has a lineage, stable multi-player use, opponent/context-dependent payoff and identifiable counter/adaptation history.

Product wording must reflect the achieved level. A pretty replay is never enough to skip levels.

---

## 4. Primitive event graph — explanation must return to football facts

Latent discovery may be neural/unsupervised, but promoted candidates must project back into primitive auditable events.

Example:

```text
P7 receives wide
→ P7 drives diagonally inward
→ D2 tracks inward
→ P3 starts outside run
→ D5 remains central
→ P3 receives in newly opened wide lane
→ attack reaches box
```

This graph contains **observations and actions**, not the conclusion `overlap`.

The discovery system may later say:

> Candidate interpretation: cut-inside → overlap enabling mechanism.

But the evidence bundle must remain usable even if the human label is wrong.

---

## 5. Counterfactual authority — explain by changing history

`PROBE-CONTRACTS.md` already establishes the correct direction: deterministic structural clone, offline paired continuations, and `counterfactual-value`-style comparisons.

The discovery system should use that authority as its causal microscope.

At a frozen moment, clone the same state/RNG and compare declared alternatives such as:

```text
Actual: winger cuts inside
Fork A: winger continues wide
Fork B: winger holds / neutral support
Fork C: same winger action, teammate overlap suppressed
Fork D: same attacking behaviour, different defender response/opponent club
```

Measure a vector, not just goal/no-goal:

```text
Δ = [opponent displacement,
     teammate available space,
     next-option count,
     line-break probability,
     possession survival,
     progression,
     xG,
     future-state embedding, ...]
```

The explanation is strongest when a compact set of interventions identifies which relationship actually creates the downstream value.

### Hard boundary

Offline oracle may inspect world truth. Live players may not. The discovery system must never feed oracle information back into the sim or use it to justify privileged live behaviour.

---

## 6. Coordination / “body language” needs causal separation from common causes

Football contains no dedicated radio channel, so many conventions may be sensorimotor:

> “when I check toward the ball, you attack the space behind me.”

But two players can also move together merely because both respond to the ball/opponent.

Therefore “默契” is a strong claim.

For a suspected P1→P2 convention, test whether P2 still changes when:

- ball/opponent/world state is held fixed;
- P1's specific action is changed in a fork;
- P2's legal observation of P1 is masked (once perception authority is live);
- player/club identities are swapped;
- shared-history / learned-state layers are reset if such layers later exist.

If P2 responds only when it can perceive P1's action, and the relationship is stable within a team/pair but not universal, that is evidence for a learned/evolved convention rather than merely parallel reaction.

---

## 7. Effect is not intent

Suppose a winger's inward carry moves a defender and opens the flank.

Safe claim:

> The inward carry has an overlap-enabling causal effect.

Stronger claim:

> The winger intentionally cuts inside **to create** the overlap.

The stronger wording requires evidence that the actor's choice depends on the relevant downstream/social state, e.g.:

- the fullback is actually positioned/prepared to exploit the lane;
- alternative downstream beneficiaries change the carrier's choice;
- when no teammate can exploit the created space, the behaviour is less likely despite similar personal shooting conditions;
- policy mediators / counterfactual conditions support that reading.

Do not infer intention from outcome or from an analyst's football vocabulary.

---

## 8. Evolutionary provenance — why this is more than XAI

For any Level-5/6 discovery, trace **when and where it came from**.

Possible timeline:

```text
Season 11  motif M17 first appears in P37
Season 15  descendants express it more often in matching contexts
Season 18  M17 couples to a fullback-run motif
Season 23  coach change modifies the coupling
Season 29  one player transfer weakens the pair mechanism
Season 31  an unrelated lineage independently discovers a functionally similar structure
Season 36  opponents adapt; M17 payoff falls
Season 40  function drifts / a replacement motif dominates
```

The provenance question should distinguish, where the world supports it:

- player DNA;
- coach philosophy;
- club/team inherited policy;
- pair/shared-history chemistry;
- transfer/mobility;
- independent convergent evolution;
- ecology/counter-adaptation.

**Convergent evolution is especially valuable:** two unrelated lineages may discover different surface forms with the same causal function.

---

## 9. Fitness ecology belongs in the explanation

EvoFootball's own history already showed that raw non-transitive-cycle counts can mislead across eras, while in-league **negative frequency dependence** is a stronger sign that diversity is self-sustaining rather than novelty-rewarded.

Discovery cards should therefore be able to say not only:

> “this mechanism exists”

but eventually:

> “it became valuable while rare, spread, opponents adapted, its payoff fell, and a counter lineage rose.”

For a candidate style/mechanism, useful ecology evidence includes:

- prevalence through seasons;
- payoff conditional on prevalence;
- opponent families that punish/help it;
- no hidden diversity/novelty reward causing artificial persistence;
- era-vs-era context separated from contemporaneous matchup effects.

Do not make cycle count the ontology of tactical diversity.

---

## 10. Open discovery, strict evidence

Open-ended discovery should **not** predefine all tactical concepts. It may search for:

- recurring relational trajectory motifs;
- new player-player response couplings;
- new shape transitions;
- new action→opponent-displacement motifs;
- new possession-phase structures;
- sudden stable changes in behaviour/function representation.

The lowest-level inductive biases may include:

- recurrence;
- predictive structure;
- causal relevance under intervention;
- lineage/ecological persistence.

These criteria decide **what deserves investigation**, not **what evolution should optimize**.

### Analytics firewall

Never feed by default into live decision or reproduction:

- motif ID;
- novelty score;
- tactical label;
- style cluster;
- causal effect embedding;
- discovery confidence.

The discovery layer decides what humans should inspect, not which club deserves to reproduce.

---

## 11. Explanation object — a minimal causal story, not a label

A mature explanation bundle should answer:

1. **What happened?** — primitive event sequence / motif.
2. **When does it happen?** — contexts and legal information states.
3. **Who responds?** — teammate/opponent relational change.
4. **What function does it have?** — counterfactual effect vector.
5. **Was that function conditionally used?** — evidence beyond accidental effect.
6. **How did it evolve?** — first appearance, inheritance/adaptation, transfer, convergence, drift.
7. **What counters it?** — ecological dependence.

Only after this bundle exists should an LLM/human produce prose such as:

> “This resembles an inverted winger creating an overlap lane.”

LLM role = narrator / summarizer of evidence. It is not the detector, causal judge or source of labels used by the sim.

---

## 12. Product surface — from WorldEvent to Evolution Discovery

`UI-NORTHSTAR.md` already requires every displayed conclusion to drill down to evidence. Discovery extends that chain:

```text
World event
→ candidate discovery
→ replay clips
→ primitive event graph
→ context / relational statistics
→ paired counterfactual branches
→ lineage + ecology
→ optional human/LLM name
```

Example card:

```text
Season 31 — New relational mechanism M17

A wide carrier repeatedly drives inward while a teammate attacks the vacated flank.
Matched forks show that removing the inward drive reduces defender inward displacement
and cuts the teammate's wide receiving-space gain.
The coupling first appeared in P37's lineage, stabilized after Season 18,
and is now being punished by two clubs that hold their fullback wider.

Candidate interpretation: cut-inside → overlap-enabling convention.
Evidence level: evolved tactical structure candidate.
```

Every card must be watchable twice:

- clean football replay;
- evidence overlay / actual-vs-counterfactual replay.

---

## 13. Implementation order — only when explicitly opened

Do not interrupt the current PROGRAMME.

When the user opens this track:

1. define a pure-observational shared trace sufficient for multi-player relation discovery;
2. multi-timescale segmentation / motif candidate generation;
3. event-graph projection;
4. context / response characterization;
5. connect the already-proven deterministic clone authority to standardized paired interventions;
6. functional-signature representation;
7. lineage / transfer / convergence tracking;
8. ecology/prevalence-payoff tracking;
9. WorldEvent/Discovery Feed product surface;
10. candidate natural-language naming last.

Known tactic detectors remain useful validation rulers, but they must not bound what can be discovered.
