# Technical survey: spatial value and off-ball positioning in football

The literature separates into three quantities that are often conflated:

1. **Accessibility/control:** who could reach or control a ball at location \(x\)?
2. **Possession value:** what is the expected outcome if play reaches state or location \(x\)?
3. **Off-ball contribution:** how did a player’s movement change accessibility or value for themselves or teammates?

No published lineage satisfies all four simulation constraints unchanged. Tracking-based models usually assume an omniscient analyst state; event-based value models are cheaper but omit off-ball geometry; the most explicit off-ball models contain expert-selected geometry, priors, or thresholds. These conflicts are often repairable through simulation census, but masking an omniscient model at inference is not enough: it generally must be fitted and validated under the same observation and memory process used by the agent.

## 1. Pitch control: Spearman PPCF and successors

### Core quantity and mathematics

A pitch-control model estimates

\[
C_i(x,t)=P(\text{player }i\text{ gains controlled possession at }x
\mid \text{current state})
\]

or its team sum. This is an **availability probability**, not a value function.

Spearman’s Potential Pitch Control Field, PPCF, combines:

- an estimated arrival time \(\tau_i(x)\), computed from current position and velocity under acceleration and maximum-speed assumptions;
- a logistic distribution \(F_i(T;x)\) around that arrival time;
- a competing-hazard process in which nearby players gain control at rate \(\lambda_i\).

In simplified form,

\[
\frac{\partial C_i(x,T)}{\partial T}
=
\left(1-\sum_j C_j(x,T)\right)
\lambda_i F_i(T;x).
\]

The residual factor is the probability that nobody has yet controlled the ball. Integrating over time produces mutually competing player-level control probabilities. Ball travel time can be included, so a slow pass and a fast pass to the same point have different interception fields.

### Original data and fitting

The model in *Beyond Expected Goals* used 25 Hz player-and-ball tracking plus synchronized events. Its movement model used fixed acceleration and maximum-speed assumptions, while arrival uncertainty, control rates, defensive advantage, transition scale, and other parameters were fitted or regularized through priors. Some parameters came from earlier pass-probability work; the OBSO paper reports MAP fitting on a small subset of its 58-match dataset. [Spearman, 2018](https://static.hudl.com/craft/downloads/SSAC2018_Beyond_Expected_Goals.pdf?mtime=20180327111214)

Subsequent work replaced hand-shaped arrival distributions with player-specific movement distributions learned from tracking. Martens, Dick and Brefeld used 54 Bundesliga matches and learned short-horizon movement frequencies before constructing control and pitch-value surfaces. [Martens et al., 2021](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2021.676179/full)

### What it buys

Pitch control supplies a useful fixed component for:

- whether a player could receive at a candidate location;
- whether a run enters a passable lane;
- defender-versus-runner races;
- overloads expressed as several attackers having substantial control probability;
- weak-side space left physically reachable;
- pressure and counterpress exposure after a movement.

It also provides player-level components before aggregation, which is useful when genes weight accessibility, risk, or positional tendencies differently.

### Constraint conflicts and repairability

- **Honest perception:** The published input is the complete world state. Missing or stale defenders do not have a defined treatment. Applying PPCF to a player’s perceived bodies is mechanically possible, but the result is no longer the published probability. It would need census calibration with scan errors, stale velocities, and unseen-player uncertainty included in the input distribution.
- **Census-only parameters:** Fixed acceleration, maximum speed, control rates, defensive advantage and arrival dispersion violate the rule if imported directly. They are unusually repairable because the simulator can measure all of them through forced races, touches, orientations, ball speeds and body states.
- **Runtime:** A dense implementation costs roughly \(O(NGMT)\): players × grid cells × ball trajectories/speeds × integration steps. Analytic pruning and learned arrival tables can reduce this, but per-player belief-specific fields multiply the cost.
- **Genes:** The substrate can remain fixed while genes weight its output. Allowing genes to alter the physical control probabilities themselves would undermine their probability interpretation.

### Failure modes and critiques

- Control is not value: uncontested space behind one’s own goalkeeper can have high control and negligible attacking utility.
- Results are sensitive to acceleration, facing, turning and control-rate assumptions.
- Many implementations treat the fastest physically plausible intercept as though the player intended to make it.
- Ball height, first-touch quality, shielding, offside and passing technique are often simplified.
- Empirical validation of pitch-control surfaces has generally been limited. Some published correlations with possession or outcomes are mediated by ball location and possession itself rather than establishing that the field adds information over simpler baselines. The 2026 DAS paper gives a detailed review of this problem. [Bischofberger and Baca, 2026](https://link.springer.com/article/10.1186/s40537-026-01387-8)

## 2. Off-Ball Scoring Opportunity: Spearman OBSO

### Core quantity and mathematics

OBSO estimates the probability that an attacking player will score from the current configuration even though that player does not currently possess the ball. It decomposes the next scoring opportunity into:

- \(T_x\): probability that the next on-ball event occurs at \(x\);
- \(C_x\): probability that the attacking team controls the ball there;
- \(G_x\): probability of scoring if the event occurs there.

Thus,

\[
P(G\mid D)
=
\int_{\text{pitch}}
P(G_x\mid C_x,T_x,D)\,
P(C_x\mid T_x,D)\,
P(T_x\mid D)\,dx.
\]

A player-specific OBSO is obtained by using that player’s PPCF contribution in the control term. [Spearman, 2018](https://static.hudl.com/craft/downloads/SSAC2018_Beyond_Expected_Goals.pdf?mtime=20180327111214)

### Original data and fitting

The control layer used tracking; the transition layer was a fitted displacement distribution for the next event, modulated by attacking control; and the scoring layer was a spatial shot/goal surface. Parameters were fitted with Bayesian priors because the estimation subset was small and tracking/event synchronization was noisy.

### What it buys

OBSO is directly aligned with:

- runs beyond or between defenders;
- far-post and box-crashing runs;
- moving into a reachable shooting location without receiving the pass;
- comparing multiple simultaneous candidate receivers;
- separating “the ball was not played” from “the player did not create an opportunity.”

It is closer to the requested emergent movement field than raw pitch control because it multiplies accessibility by goal relevance.

### Constraint conflicts and repairability

- The complete current state is omniscient.
- Transition and scoring surfaces are fitted from observed human choices, not forced alternatives. Unattempted passes and deliberately avoided destinations remain weakly identified.
- Priors and fixed motion constants violate strict census-only rules.
- The score surface is primarily useful near goal. Without a longer-horizon continuation value, dropping to receive or maintaining weak-side structure may receive almost no signal.
- Dense player-specific evaluation is costly because PPCF is inside the spatial integral.

Most numerical conflicts are census-repairable. The harder conceptual issue is the transition model: census must determine whether it estimates what the current ball carrier is likely to choose, what is physically feasible, or what would happen if a pass were forced.

### Failure modes and critiques

The paper itself identifies several:

- its transition distribution lacks a strong explicit preference for useful progression;
- shot selection biases the scoring surface because only positions from which players actually shot are observed;
- defensive pressure enters mainly through control rather than a rich finishing model;
- ball height, blocked passing paths and individual passing/finishing skill are simplified;
- it predicts essentially the next scoring event, so deeper buildup value is weak.

## 3. Fernández–Bornn: influence, occupation and space generation

### Core quantity and mathematics

*Wide Open Spaces* begins with a per-player spatial influence function. Player \(i\)’s influence at point \(p\) is a normalized anisotropic Gaussian:

\[
I_i(p,t)
=
\frac{\mathcal N(p;\mu_i(t),\Sigma_i(t))}
     {\mathcal N(p_i(t);\mu_i(t),\Sigma_i(t))}.
\]

The mean is displaced in the direction of motion and the covariance is elongated with velocity and adjusted by distance from the ball. A team-control surface is obtained by combining or contrasting player influences through a sigmoid.

A separate pitch-value model predicts \(V(p\mid b)\), the value of location \(p\) given ball position \(b\). The player’s occupied-space quality is roughly

\[
Q_i(p,t)=I_i(p,t)\,V(p\mid b_t),
\]

or its controlled-space analogue. **Space Occupation Gain** is the temporal increase in quality occupied by a player. **Space Generation Gain** measures value opened for a teammate when a defender is attracted by the evaluated player’s movement. [Fernández and Bornn, 2018](https://www.lukebornn.com/papers/fernandez_ssac_2018.pdf)

### Original data and fitting

The study used tracking from approximately 20 matches to construct millions of grid-point examples. Pitch value was learned with a feed-forward network whose target was the defending team’s observed influence at each location, based on the hypothesis that defenders tend to occupy valuable space.

Several influential ingredients were expert-chosen: Gaussian radii, motion scaling, maximum speed, attraction distance, temporal windows, gain thresholds, and a goal-distance normalization. The final off-ball examples were demonstrated primarily on one match.

### What it buys

This is the literature’s most explicit vocabulary for the requested behaviours:

- occupation of valuable gaps;
- a run that drags a marker away from a teammate;
- overloads and underloaded weak sides;
- separating space created for oneself from space generated for others;
- detecting valuable stationary positioning, not only ballward movement.

Its decomposition is also compatible with gene weighting: occupation, accessibility and teammate externality can remain separate fixed components.

### Constraint conflicts and repairability

- **Omniscience:** All players’ current positions and velocities are used.
- **Hand construction:** The original influence geometry and many thresholds violate the census rule.
- **Pitch-value target:** “Defenders stand in valuable places” learns the historical defensive policy, not necessarily causal value. A tactical convention or formation becomes labelled as value even when a deliberately empty weak-side zone is exploitable.
- **Compute:** Gaussian influence on a grid is relatively cheap, \(O(NG)\), making this one of the more mobile-compatible tracking models.
- **Census repair:** Geometry, attraction and time thresholds can be estimated by perturbing simulated runs and measuring subsequent control or outcomes. But replacing defender occupancy with an outcome-based label changes the interpretation of the original pitch-value model.

### Failure modes and critiques

- There is no direct ground truth for “space created.”
- The Gaussian influence model can be overly broad and ignores individual turning, acceleration and movement limits.
- The value target is circular: defenders’ choices are both evidence of value and products of the tactics being evaluated.
- Space-generation credit depends strongly on thresholds for “attraction” and temporal association.
- Correlated teammate movements make individual attribution unstable or double-count shared gains.
- Martens et al. noted limited quantitative evaluation and replaced the hand-shaped influence layer with data-driven movement models. [Martens et al., 2021](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2021.676179/full)

## 4. Tracking-based soccer EPV: Fernández–Bornn–Cervone lineage

### Core quantity and mathematics

The lineage comes from Cervone et al.’s multiresolution basketball EPV, which estimates the expected points at the end of a possession by connecting continuous movement to discrete possession events. [Cervone et al., 2016](https://arxiv.org/abs/1408.0777)

For football, EPV is the expected signed possession outcome:

\[
\operatorname{EPV}(T_t)=E[G\mid T_t],
\]

where \(G\) represents a subsequent goal for or against the possessing side. The model decomposes over possible next actions:

\[
\operatorname{EPV}(T_t)
=
\sum_{a\in\{\text{pass, carry, shot}\}}
P(A=a\mid T_t)\,
E[G\mid A=a,T_t].
\]

For a pass, destination and outcome are further decomposed:

\[
E[G\mid A=\text{pass},T]
=
\int_x P(X=x\mid A,T)
\sum_{o\in\{\text{complete,turnover}\}}
P(o\mid x,T)\,
E[G\mid x,o,T]\,dx.
\]

The important product is not one scalar but several surfaces:

- pass-selection likelihood;
- pass-completion probability;
- continuation value after success;
- value after failure;
- action-selection probability.

The soccer framework evolved from separate neural networks into convolutional spatial models. [Fernández, Bornn and Cervone, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8570314/)

### Original data and fitting

The conference work used proprietary optical tracking from the English Premier League and FC Barcelona, with positions, velocities, ball location and event labels. CNNs or shallow neural networks learned action choice, destination, completion and continuation values. The models also included engineered context such as pressure, defensive lines, players bypassed and interceptability. [Conference version](https://barcainnovationhub.fcbarcelona.com/wp-content/uploads/2024/03/Decomposing-the-Immeasurable-Sport.pdf)

### What it buys

EPV offers the richest published account of spatial risk and reward:

- a candidate receiving cell has both completion probability and continuation value;
- dropping, running beyond, entering the box and switching weak side can all be valuable for different reasons;
- turnover risk is represented explicitly;
- the model can distinguish a destination that is valuable if reached from one that is realistically reachable;
- long-range buildup can receive value before an immediate shooting chance exists.

### Constraint conflicts and repairability

- **Omniscience:** Full tracking is central to the model.
- **Honest-perception distribution shift:** Feeding masked or stale tracks into a model trained on perfect state produces out-of-distribution inputs. It must be trained on player observations or belief states to preserve probabilistic meaning.
- **Census fitting:** A simulator can generate every label, but pass-selection and continuation models require a precise intervention policy. Forced passes answer a different question from observed action selection.
- **Hand features:** Pressure lines and “outplayed defenders” are partly expert-designed substrate.
- **Data and compute:** Dense destination labels and rare scoring outcomes require large datasets. CNN inference over several action-conditioned surfaces is heavy for per-player mobile updates, especially if every player has a different perceived state.
- **Genes:** EPV normally learns the action mixture from population behaviour. Replacing those learned mixture weights with genes changes EPV from a calibrated expectation into a preference-weighted utility.

### Failure modes and critiques

- Observed pass calibration does not validate the value of destinations that were rarely or never targeted.
- The model learns the behaviour policy: common choices receive abundant data; tactically novel alternatives are extrapolation.
- Rarely represented pitch regions can show edge, cover-shadow or occupancy artifacts.
- Original data and code were proprietary, complicating reproduction.
- A 2025 replication failed to reproduce the earlier results and introduced a U-Net and a 50-pair expert benchmark; its replacement correctly ordered 78% of the benchmark pairs. This is useful progress but also illustrates how limited normal predictive loss is as validation of a counterfactual field. [Overmeer et al., 2025](https://www.scitepress.org/PublishedPapers/2025/137843/)
- Models generally describe an average player unless individual skill is explicitly conditioned.

## 5. VAEP-style action values

### Core quantity and mathematics

VAEP values an observed action by the change it causes in the probabilities of scoring and conceding:

\[
Q(S_i)=P_{\text{score}}(S_i)-P_{\text{concede}}(S_i),
\]

\[
V(a_i)=Q(S_i)-Q(S_{i-1}).
\]

The original implementation predicted whether a team would score or concede within the next \(k=10\) actions. [Decroos et al., 2019](https://arxiv.org/abs/1802.07127)

### Original data and fitting

VAEP used event data rather than tracking. Two CatBoost classifiers were fitted on 11,565 matches. Features described the last three actions: action type and result, start/end coordinates, time, body part, possession changes, scoreline, goal distance/angle, and spatial/temporal differences between actions.

### What it buys

- A measurable signed outcome target that includes both reward and turnover risk.
- Cheap runtime after fitting.
- Values across buildup rather than only near the box.
- A useful target for validating whether a spatial component actually improves future scoring/conceding prospects.

### Constraint conflicts and repairability

- Classic VAEP has no off-ball state, so it cannot distinguish two identical passes made into different defender or teammate configurations.
- It values observed actions, not unchosen player locations.
- Using it as a positional field requires defining a hypothetical action or state transition for every location.
- Census fitting is feasible, but the simulator must decide whether the counterfactual includes only relocating a player or also rewinding subsequent decisions.
- The original state representation is public event history, not the acting player’s perceived state.

### Failure modes and critiques

- The three-action input and ten-action outcome window are design choices rather than a football law.
- Goals are sparse, producing high-variance credit.
- It can blame an action for downstream events caused by many other players.
- It does not credit off-ball contributors unless they affect a recorded action.
- A critical comparison found split-half season-level player-rating correlations of \(0.25\) for full VAEP versus \(0.89\) for xT; restricting VAEP to offensive ball-progressing actions improved it to \(0.59\). Goal credit and low-frequency defensive events were major sources of volatility. [Van Roy et al., 2020](https://tomdecroos.github.io/reports/xt_vs_vaep.pdf)

## 6. Expected Threat and tabular Markov value

### Core quantity and mathematics

Expected Threat, xT, partitions the pitch into zones and treats possession movement as a Markov process:

\[
xT(z)
=
s(z)g(z)
+
m(z)\sum_{z'}T(z,z')xT(z'),
\]

where:

- \(s(z)\): probability of shooting;
- \(g(z)\): probability the shot scores;
- \(m(z)\): probability of moving the ball;
- \(T(z,z')\): probability of a successful move to \(z'\).

A successful movement receives

\[
V(z\rightarrow z')=xT(z')-xT(z).
\]

The canonical implementation used the 2017/18 Premier League event stream. [Singh, 2019](https://karun.in/blog/expected-threat.html)

### Original data and fitting

All terms are census counts or smoothed counts from event data: shots, goals, attempted action types and successful movement destinations. The fixed point is obtained by iteration.

### What it buys

- Extremely cheap lookup and interpolation.
- Long-range buildup value without waiting for a shot.
- Every table has an immediate census interpretation.
- A useful location-only baseline against which richer spatial models should demonstrate added value.

### Constraint conflicts and repairability

- It does not see defenders, teammates, passing lanes, offside, orientation or perception.
- A player could only use it off ball by treating their location as a hypothetical future ball location.
- The canonical version counts only successful moves, omitting the risk of failed attempts.
- Expanding the state with perceived bodies, memory and player identity produces a combinatorial table explosion and eventually ceases to be classic xT.

### Failure modes and critiques

- Path independence: moving around a loop has zero value even if the loop disorganizes defenders.
- Two positions in the same cell are indistinguishable.
- Same-zone actions have zero nominal value.
- It learns historical team behaviour and shot selection.
- It cannot represent weak-side balance or space generation except insofar as those later cause an observed ball movement.
- It is robust partly because it is coarse; robustness does not imply causal correctness.

## 7. Dangerousity

### Core quantity and mathematics

Link, Lang and Seidenschwarz define a continuous on-ball **Dangerousity** score from four components:

- \(ZO\): zone value;
- \(CO\): ball control;
- \(PR\): defensive pressure;
- \(DE\): defensive density.

Structurally,

\[
DA(t)
=
ZO(t)\,
\left[
1-\frac{(1-CO(t))+PR(t)+DE(t)}{k_1}
\right],
\]

with component-specific geometry and constants. Action Value is the change in dangerousity between successive individual ball actions. [Link et al., 2016](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0168768)

### Original data and fitting

The study used 64 Bundesliga matches from 2014/15 with TRACAB tracking. The five main constants and geometric rules were adjusted manually with football experts over more than 100 situations. Validation compared 100 scenarios with ratings from three semi-professional coaches; inter-rater agreement was only fair, \(\kappa=.32\).

### What it buys

The component vocabulary is useful and cheap:

- distance/angle value;
- control quality;
- pressure;
- shot-block and pass-interception density;
- local overloads.

It is also interpretable enough to expose separate fixed substrate components to genes.

### Constraint conflicts and repairability

The original model conflicts strongly with the house rules:

- constants and zone geometry were deliberately expert-designed;
- it uses full tracking;
- it only exists while a player controls the ball;
- the zone map covers the final 34 m, making it unsuitable for buildup depth or defensive balance.

The functional skeleton could be census-fitted, but importing the published maps or constants would not be compliant.

### Failure modes and critiques

The paper explicitly notes omitted facing, player movement dynamics, relation to the ball, teammate availability, individual skill, offside, set pieces and fouls. Its evaluation mainly establishes agreement with its designers’ football intuition. Correlations with possession, shots or betting strength do not isolate the incremental validity of the spatial formula.

## 8. Learned whole-configuration value: Dick and Brefeld

### Core quantity and mathematics

Dick and Brefeld learn a scalar value \(V_\theta(s_t)\) directly from rasterized tracking states using batch deep reinforcement learning. A temporal-difference target has the usual form

\[
G_t^{(n)}
=
\sum_{j=0}^{n-1}\gamma^j r_{t+j}
+
\gamma^n V_\theta(s_{t+n}),
\]

and the convolutional network minimizes

\[
\left(V_\theta(s_t)-G_t^{(n)}\right)^2,
\]

with TD(\(\lambda\))-style aggregation across horizons. [Dick and Brefeld, 2019](https://ml3.leuphana.de/publications/big.pdf)

### Original data and fitting

The input was a nine-channel spatial representation of team positions, ball and velocities. The study used only five European top-flight matches, evaluated leave-one-match-out. Successful episodes were defined by progression into designated attacking regions rather than goals alone.

### What it buys

- It values the entire multiplayer configuration rather than only the ball.
- Off-ball positioning can receive value without an explicit pass being attempted.
- No expert combination weights are required once the state encoding and reward are fixed.
- Counterfactual relocation can be evaluated by comparing network values.

### Constraint conflicts and repairability

- Full tracking is assumed.
- The state reward and terminal attacking regions are themselves hand-selected.
- A per-player honest-perception version requires a different network and training distribution.
- One CNN inference may be tolerable, but one field per candidate location per player is much more expensive.
- Interpretability and component-level gene weighting are poor because value is entangled in one network.

### Failure modes and critiques

- Five games are insufficient for broad tactical coverage.
- It evaluates states under observed play, not an optimal policy.
- Counterfactual rearrangements may be far outside its training distribution.
- Sparse successful attacks increase variance near goal.
- The scalar does not explain whether value came from depth, width, overload, balance or a particular player.

## 9. Counterfactual trajectories and C-OBSO

### Core quantity and mathematics

Counterfactual “ghosting” models learn reference player trajectories and compare the actual state with what an average or team-specific player would have done.

C-OBSO generates reference trajectories with a variational recurrent model and evaluates

\[
C\text{-}OBSO_i
=
\left[
OBSO(\text{actual trajectories})
-
OBSO(\text{reference trajectories for }i)
\right]_+.
\]

It therefore credits an off-ball player when actual movement creates a larger scoring opportunity than the learned reference movement. [Teranishi et al., 2022](https://arxiv.org/abs/2206.01899)

### Original data and fitting

The study used 412 shot sequences from one J-League team, with full positions and velocities for 22 players and the ball. A graph variational recurrent network predicted approximately four seconds of reference movement, focusing on the evaluated attacker and closely interacting defenders.

### What it buys

- Direct counterfactual credit for runs and defender attraction.
- A temporal rather than frame-local conception of space generation.
- A reference against which unusual cutting, decoy or box-crashing behaviour can be measured.

### Constraint conflicts and repairability

- Inputs are omniscient and inference is comparatively heavy.
- The learned reference is average observed behaviour, not necessarily the best alternative.
- The positive-part truncation is a design choice.
- Prediction errors grow with horizon.
- Census could generate forced trajectory alternatives, but the number of joint trajectories is enormous and interactions make single-player perturbations questionable.

### Failure modes and critiques

- No objective ground truth exists for the reference movement.
- Behavioural cloning reproduces tactical conventions and mistakes.
- Changing one attacker without coherently changing defenders and teammates creates physically inconsistent counterfactuals.
- Results depend on which interacting players are included.
- Small, single-team data limits generalization.

## 10. Dangerous Accessible Space

### Core quantity and mathematics

The 2026 DAS model reframes a pass as a continuous-time competing-risk process. \(S_0\) denotes “not yet intercepted,” while \(S_r\) denotes interception by player \(r\):

\[
\frac{dP_0(t)}{dt}
=
-P_0(t)\sum_r a_r(t),
\qquad
\frac{dP_r(t)}{dt}
=
P_0(t)a_r(t).
\]

The interception hazard \(a_r(t)\) depends on the difference between player arrival time and ball time, with an additional ball-speed control term. Simulating pass directions and speeds produces a completion possibility map \(C(x)\).

Accessible Space and Dangerous Accessible Space are

\[
AS=\int_B C(x)\,dx,
\qquad
DAS=\int_B C(x)V(x)\,dx,
\]

where \(V(x)\) is a simple distance-and-angle xG surface. [Bischofberger and Baca, 2026](https://link.springer.com/article/10.1186/s40537-026-01387-8)

### Original data and fitting

The model used three open Metrica matches: 3,696 passes, reduced to 3,523 after excluding crosses and clearances. It fitted physical and hazard parameters against pass outcomes, using synthetic unsuccessful passes to address class imbalance. Code and validation are public.

### What it buys

- A clearer action-grounded meaning than abstract pitch control: space is valuable if it can be reached by a pass or carry.
- Explicit risk–reward separation through \(C(x)V(x)\).
- Natural treatment of running into passing lanes and defenders closing alternatives.
- Counterfactual defender removal or repositioning without needing large numbers of historical passes to every exact target.

### Constraint conflicts and repairability

- It still uses the complete tracking frame.
- It requires multiple pass simulations over directions/speeds, creating a significant mobile cost when repeated for each player’s perception.
- The value model is a simple hand-selected functional family, although its coefficients are fitted.
- Physical bounds and synthetic-negative generation would have to be justified by simulator census.
- It estimates pass **possibility** but not the probability that the ball carrier will select that pass.

### Failure modes and critiques

- The validated model is chiefly for ground or low passes; aerial balls remain problematic.
- Three matches provide limited tactical and skill coverage.
- Synthetic impossible passes can distort calibration if their sampling distribution differs from real attempted alternatives.
- Pass-selection, player vision and orientation are absent.
- The xG value surface does not capture continuation after receiving far from goal.
- Individual pass predictions reportedly discriminate best at the extremes and less strongly in ambiguous mid-probability cases.

## Comparison table

| Lineage | Core output | Original evidence | Direct off-ball value | Main constraint conflict | Relative runtime |
|---|---|---|---|---|---|
| Spearman PPCF | Probability each player/team controls a ball at \(x\) | Full tracking; fitted arrival/control parameters and physical assumptions | Medium: reachability, lanes, overloads | Omniscient; fixed physics; control is not utility | Medium–high |
| Spearman OBSO | Probability an off-ball player scores via the next event | Tracking + events; fitted transition, PPCF and score maps | High near goal | Omniscient; short horizon; observed-choice bias | High |
| Fernández–Bornn space | Influence × learned pitch value; occupation and generation gains | Tracking; defensive occupancy target; expert geometry | Very high semantically | Hand thresholds; occupancy/value circularity | Medium |
| Tracking EPV | Expected signed outcome, decomposed by action, destination and success | Large proprietary tracking/event data; neural models | High | Omniscient; data/compute heavy; weak hypothetical coverage | Very high |
| VAEP | Change in score/concede probability after an action | 11,565-match event dataset; gradient-boosted classifiers | Low | No off-ball geometry; only observed actions | Low |
| xT | Markov value of ball location | One-season event counts and transitions | Low | Ignores players, risk and perception | Very low |
| Dangerousity | Zone adjusted for control, pressure and density | 64 matches; constants manually fitted with experts | Low–medium near ball | Explicit hand construction; final-third and on-ball only | Low |
| Learned configuration value | CNN value of complete spatial state | Five matches; TD learning with proxy attack reward | High but opaque | Omniscient; proxy reward; OOD counterfactuals | Medium per evaluation |
| C-OBSO/ghosting | Actual opportunity minus predicted reference opportunity | 412 shot sequences; recurrent trajectory model | Very high | Heavy, omniscient, reference is behaviour rather than optimum | Very high |
| DAS | Integral of pass-accessibility × spatial goal value | Three matches; physical pass model plus fitted xG | High | Many simulations; ground-pass scope; no selection model | High |

## Open design questions independent of lineage

### 1. What exactly is the agent-conditioned state?

The team must decide whether a field is:

\[
V_i(x)=V(x\mid \text{player }i\text{’s current observation})
\]

or

\[
V_i(x)=E[V(x\mid S)\mid B_i],
\]

where \(B_i\) is a belief over possible true states given scans and memory. Simply deleting unseen players implies they do not exist; retaining stale points as truths creates false certainty. Whatever representation is chosen must be used during both census fitting and runtime evaluation.

### 2. What counterfactual does a census cell estimate?

“Forcing player \(i\) to \(x\)” is incomplete. The team still must specify:

- travel path and arrival time;
- whether other players react during the intervention;
- whether the ball carrier is forced to pass or remains free;
- which RNG streams are paired between forks;
- whether value concerns the next touch, possession, goal, or discounted match outcome.

Different choices estimate different causal quantities even from the same deterministic world.

### 3. How are components separated without double counting?

Accessibility, pass selection, pass success, continuation value, turnover risk, teammate space generation and defensive-rest value overlap. For example, multiplying pitch control by EPV and then adding an overload term may count the same defender displacement twice. Component normalization also matters because gene evolution can exploit whichever component has the largest variance or easiest gradient.

### 4. How will census coverage handle rare and out-of-policy states?

Goals provide clean labels but are sparse; short-horizon proxies are dense but may optimize sterile possession. Forced alternatives provide coverage, but extreme relocations can create states that normal movement policies never encounter. Coverage must also span body orientation, stamina, skill, match state, player count and the transition from 6v6 to 11v11.

### 5. What field resolution and update dynamics remain stable under independent movement?

Even a correctly calibrated state value does not imply that every player independently ascending its local gradient produces good joint play. Likely pathologies include pile-ups, oscillation between adjacent cells, simultaneous duplicate runs, abandonment of rest defence, and feedback loops caused by stale perceived teammates. The unresolved issue is therefore not just grid size and frame budget, but whether the value field remains useful under the movement policy it induces.

These questions determine the estimand, observability and validation regime; the published lineages mainly supply candidate mathematical decompositions, not answers to them.