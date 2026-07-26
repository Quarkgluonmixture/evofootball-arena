# Realism Ledger — first draft

Static audit of the shipped defaults on 26 July 2026. No code was changed.

Two interpretation rules matter:

- Spatial geometry using `FIELD_SCALE` or `GOAL_AND_BOX_SCALE` is compared with both the unscaled Laws and a ×0.7 similarity target.
- Bodies, reach, speed and time are explicitly unscaled, so they are judged first in raw SI units. Where raw values are plausible but make play 1/0.7 ≈ 43% faster or larger relative to the pitch, I mark a **SCALE ALERT** rather than automatically calling them unrealistic.

`OUTSIDE` means the value falls outside a published range or an exact law-derived scaled value. `FORM MISMATCH` means the real quantity exists, but the simulation’s mathematical form prevents a clean one-number comparison.

## Anchor basis

- **LAW-GEO:** IFAB Law 1: full pitches 90–120 × 45–90 m; international 100–110 × 64–75 m; goal 7.32 × 2.44 m; penalty area 16.5 m deep and 40.32 m wide; penalty mark 11 m; centre/penalty arcs 9.15 m. [IFAB Law 1](https://www.theifab.com/laws/latest/the-field-of-play/?side-menu-open=true)
- **LAW-BALL:** circumference 68–70 cm, implying radius 0.108–0.111 m. [IFAB Law 2](https://www.theifab.com/laws/latest/the-ball/)
- **LAW-RESTART:** free kicks and corners require 9.15 m; penalties also 9.15 m plus positional restrictions; throw-ins require 2 m. [Free kicks](https://www.theifab.com/laws/latest/free-kicks/), [penalties](https://theifab.com/laws/latest/the-penalty-kick/), [corners](https://www.theifab.com/laws/latest/the-corner-kick/), [throw-ins](https://www.theifab.com/laws/latest/the-throw-in/)
- **GRAVITY:** standard gravity is 9.80665 m/s². [NIST SI guide](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)
- **TURF-ROLL:** FIFA/UEFA-style test ball starts around 3.2 m/s and should roll roughly 4–8 m; published turf measurements give deceleration near `0.40 + 0.17v`, about 0.8–1.0 m/s² at 2.5 m/s. [Kolitzus, *Ball Roll Behavior*](https://www.isss-sportsurfacescience.org/downloads/documents/ZPKPAJJUWY_Ball_Roll_BehaviorKS.pdf)
- **TURF-BOUNCE:** FIFA Quality Pro vertical rebound is 0.60–0.85 m from a 2 m drop, equivalent to vertical restitution about 0.55–0.65. [FIFA Football Turf requirements](https://www.footballvictoria.com.au/sites/ffv/files/2023-04/FIFA_Quality_Manual_Handbook-of-requirements-2015.pdf)
- **RUN:** observed elite peak match speeds are about 8.1–8.8 m/s, with a larger study reporting 9.14 ± 0.39 m/s. [Peak-speed study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11694206/), [professional sprint study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11167479/)
- **ACCEL:** reported maximum match acceleration is about 3.3–5.4 m/s²; theoretical acceleration-speed profiles reach about 5.7–8.7 m/s². [Velocity/acceleration review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11769499/)
- **KICK:** experienced side-foot kicks averaged 21.4 ± 1.5 m/s; elite male maximal shots are commonly about 25–35 m/s. [Nunome et al.](https://pubmed.ncbi.nlm.nih.gov/17892095/), [Kellis/Lees review material](https://jssm.org/volume10/iss1/cap/jssm-10-203.pdf)
- **BALL-TRACK:** 7.9–22.3 m/s was used as a realistic pass/ball-speed validation range; deliberate passes are detectable from roughly 8 m/s. [Tracking validation](https://www.sciencedirect.com/science/article/pii/S1877705816306919), [World Cup tracking study](https://www.mdpi.com/2076-3417/15/15/8694)
- **REACTION:** football/futsal goalkeeper work commonly separates anticipation from post-stimulus reaction at about 200 ms. [Futsal goalkeeper reaction study](https://www.scielo.br/j/jpe/a/r4WYtRNtR47vWJp4v8vzGFg/)
- **XG:** real xG models learn from thousands of shots and normally include distance, angle, body part and assist type; richer models add player and goalkeeper locations. [StatsBomb xG methodology](https://statsbomb.com/soccer-metrics/expected-goals-xg-explained/)
- **FK-RATE:** an observed Premier League direct-free-kick conversion rate was 4.72%. [Premier League analysis](https://www.premierleague.com/en/news/693397)
- **AERO:** real ball drag is strongly speed- and ball-dependent; aerodynamic simulations show material reductions in flight time and range versus vacuum trajectories. [Soccer-ball drag study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4038026/), [full-flight simulation](https://link.springer.com/article/10.1007/s00466-025-02705-2)
- **SPIN:** measured spin decay depends on the product of initial spin and forward speed, rather than a universal fixed exponential rate. [Barber et al., *The spin decay of sports balls in flight*](https://shura.shu.ac.uk/2132/)
- **GK/JUMP:** professional goalkeepers are usually over 1.80 m and jump higher than outfield players; soccer jump research does not support a universal contact-height cutoff. [Ziv & Lidor review](https://doi.org/10.1123/ijspp.6.4.509), [elite-soccer jump review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11467003/)

## `src/sim/constants.ts`

| Name | Shipped value | Unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---:|---|---|---|---|
| `LEGACY_PITCH_SCALE` | unset; optional env | ratio | Legacy source for field and goal/box scale | **DESIGNED** — compatibility/probe control, not football physics | No counterpart |
| `FIELD_SCALE` | 0.7 | ratio | Pitch dimensions and centre circle | **DESIGNED** — explicit density compression | Produces a lawful scaled general pitch, but not a scaled international-width pitch |
| `GOAL_AND_BOX_SCALE` | 0.7 | ratio | Goal width and penalty-box geometry | **DESIGNED** — explicitly decoupled geometry compression | Individual derived dimensions below reveal non-uniform scaling |
| `BODY_SCALE` | 1 | ratio | Minimum player separation/core size | **DESIGNED** — body geometry deliberately remains unscaled | **SCALE ALERT:** bodies are 43% larger relative to the pitch |
| `CONTROL_REACH_SCALE` | 1 | ratio | Ball-control radius | **DESIGNED** — reach remains unscaled | **SCALE ALERT:** reach is 43% larger relative to the pitch |
| `SPEED_TIME_SCALE` | 1; currently unused | ratio | Intended authority for speed/time scaling | **DESIGNED** — declared world-model choice, but no consumer uses it | **SCALE ALERT:** physical speeds on a ×0.7 field imply 43% faster pitch-relative transit |
| `PITCH_LENGTH` | 63 | m | Goal-line-to-goal-line extent | **DESIGNED** — `90 × 0.7` | LAW-GEO scaled general range 63–84 m: inside; scaled international 70–77 m: below |
| `PITCH_WIDTH` | 40.6 | m | Touchline-to-touchline extent | **DESIGNED** — `58 × 0.7` | LAW-GEO scaled general range 31.5–63 m: inside; scaled international 44.8–52.5 m: **OUTSIDE** |
| `HALF_L` | 31.5 | m | Longitudinal boundary and formation coordinate | **DESIGNED** — exact derivative of designed pitch | Same verdict as `PITCH_LENGTH` |
| `HALF_W` | 20.3 | m | Lateral boundary and formation coordinate | **DESIGNED** — exact derivative of designed pitch | Same verdict as `PITCH_WIDTH` |
| `OUT_PLAY_COAST` | 0.5 | s | Visual coast before goal-line restart | **DESIGNED** — presentation delay | No real-law counterpart |
| `GOAL_WIDTH` | 4.9 | m | Goal mouth, aiming and scoring | **DESIGNED** — scaled arcade goal | LAW-GEO ×0.7 target is 5.124 m: **OUTSIDE −4.4%** |
| `GOAL_DEPTH` | 2.2 | m | Rendered net depth | **DESIGNED** — goal depth is not fixed by the Laws | Plausible installation value; little gameplay effect |
| `GOAL_HEIGHT` | 2.44 | m | Crossbar and over-bar test | **ANCHORED** — exact IFAB height | Exact LAW-GEO value; **SCALE ALERT** because width is scaled but height is not |
| `BOX_DEPTH` | 9.1 | m | Penalty-area depth and keeper-hand boundary | **DESIGNED** — scaled custom box | LAW-GEO ×0.7 target 11.55 m: **OUTSIDE −21.2%** |
| `BOX_WIDTH` | 19.6 | m | Penalty-area width | **DESIGNED** — scaled custom box | LAW-GEO ×0.7 target 28.224 m: **OUTSIDE −30.6%** |
| `CENTER_CIRCLE_R` | 4.9 | m | Drawn centre circle | **DESIGNED** — compressed restart geometry | LAW-GEO ×0.7 target 6.405 m: **OUTSIDE −23.5%** |
| `DT` | 1/60 = 0.01667 | s/tick | Fixed integration timestep | **DESIGNED** — numerical resolution | Not a football observable |
| `MATCH_DURATION` | 240 | sim s | Full match mapped to displayed 90 minutes | **DESIGNED** — time compression | One sim second represents 22.5 displayed seconds |
| `STOPPAGE_MAX` | 8 | sim s | Maximum safe-break extension per half | **DESIGNED** — about three displayed minutes | Added time is empirical, not a fixed law value |
| `SURFACE_PROFILE` | seven fields below | mixed | Single turf-response authority | **UNCLEAR** — physical intent, but not calibrated to a named surface | See field-level verdicts |
| `SURFACE_PROFILE.ballFrictionK` | 0.55 | s⁻¹ | Exponential ground-speed decay | **UNCLEAR** — real turf deceleration is speed-dependent but not simply proportional across pass speeds | At 3.2 m/s it gives 5.82 m asymptotic roll, within 4–8 m; at 2.5 m/s it gives 1.375 m/s² versus 0.8–1.0: **OUTSIDE locally / FORM MISMATCH** |
| `SURFACE_PROFILE.ballBounce` | 0.45 | restitution | Vertical rebound velocity fraction | **UNCLEAR** — directly physical but low versus pitch tests | Two-metre drop rebounds about 0.405 m; TURF-BOUNCE says 0.60–0.85 m: **OUTSIDE** |
| `SURFACE_PROFILE.bounceDamp` | 0.72 | ratio | Horizontal speed retained after bounce | **UNCLEAR** — real value depends on angle, spin, turf and ball | No defensible universal point anchor |
| `SURFACE_PROFILE.bounceMinVz` | 2.2 | m/s | Vertical impact below which the ball settles | **UNCLEAR** — physical transition represented as a hard cliff | Real settling is continuous; no published universal cutoff |
| `SURFACE_PROFILE.airSpinDecay` | 0.25 | s⁻¹ | Exponential decay of curvature rate in air | **UNCLEAR** — physical counterpart exists | SPIN finds decay depends on speed × spin: **FORM MISMATCH** |
| `SURFACE_PROFILE.groundSpinDecay` | 1.5 | s⁻¹ | Exponential decay of curvature rate on turf | **UNCLEAR** — surface-dependent physical effect | No suitable one-number football anchor located |
| `SURFACE_PROFILE.bounceSpinRetention` | 0.55 | ratio | Curvature retained at bounce | **UNCLEAR** — impact/spin coupling is physical but state-dependent | No universal point anchor |
| `BALL_FRICTION_K` | 0.55 | s⁻¹ | Runtime alias for ground decay | **UNCLEAR** — same physical model as profile field | Same mixed/OUTSIDE verdict as `ballFrictionK` |
| `BALL_AIR_SPIN_DECAY` | 0.25 | s⁻¹ | Runtime air-spin alias | **UNCLEAR** | SPIN: **FORM MISMATCH**; moreover airborne translational speed has no drag |
| `BALL_GROUND_SPIN_DECAY` | 1.5 | s⁻¹ | Runtime ground-spin alias | **UNCLEAR** | Surface-specific calibration required |
| `BALL_BOUNCE_SPIN_RETENTION` | 0.55 | ratio | Runtime bounce-spin alias | **UNCLEAR** | Impact-specific calibration required |
| `STAMINA_DRAIN` | 0.01 | stamina/s at effort² | High-effort fatigue | **DESIGNED** — comments explicitly price the sim’s energy economy | Cannot map directly through the 240 s → 90 min clock |
| `STAMINA_RECOVERY` | 0.009 | stamina/s | Jog/idle recovery | **DESIGNED** — tuned against sim end-state stamina | Same mapping problem |
| `TACKLE_LUNGE_COST` | 0.02 | stamina/attempt | Flat tackle burst cost | **DESIGNED** — explicit gameplay price | No physiological one-attempt equivalent |
| `DEFLECT_BLIND_PEN` | 0.75 | probability multiplier | Up to 75% reduction for blind drilled-ball deflection | **DESIGNED** — explicit anti-omniscience lever | Requires sim event calibration |
| `CONTACT_BLIND_PEN` | 0.7 | probability multiplier | Blind-side contact penalty | **DESIGNED** — explicit interception/cutback tuning | Requires sim event calibration |
| `UNSET_BLOCK_WEIGHT` | 0.55 | ratio | Minimum effectiveness of moving/blind shot blockers | **DESIGNED** — explicit shot-channel tuning | Requires shot/block census |
| `CROSS_LEAD_FRAC` | 0.4 | ratio | Fraction of receiver motion used to lead crosses | **DESIGNED** — meetability correction | No direct real constant |
| `CROSS_LEAD_MAX` | 3.5 | m | Maximum cross lead | **DESIGNED** — caps evolved delivery geometry | Plausible movement lead, but context-dependent |
| `GRAVITY` | 9.81 | m/s² | Lofted-ball vertical acceleration | **ANCHORED** — Earth gravity | NIST 9.80665; excellent match |
| `BALL_BOUNCE` | 0.45 | restitution | Runtime vertical bounce | **UNCLEAR** | TURF-BOUNCE: **OUTSIDE low** |
| `BOUNCE_DAMP` | 0.72 | ratio | Runtime horizontal bounce damping | **UNCLEAR** | No universal point anchor |
| `BOUNCE_MIN_VZ` | 2.2 | m/s | Runtime settling threshold | **UNCLEAR** | Hard-cliff model lacks direct anchor |
| `CONTROL_MAX_HEIGHT` | 1.3 | m | Highest foot/ordinary control contact | **UNCLEAR** — anatomical/mechanical counterpart, but skill-dependent | Roughly waist/upper-thigh height; plausible, low confidence |
| `HEADER_MIN_HEIGHT` | 1.35 | m | Bottom of header-only contest band | **UNCLEAR** — players can stoop or use feet/chest at overlapping heights | Plausible transition, not a physical hard boundary |
| `HEADER_MAX_HEIGHT` | 2.5 | m | Highest outfielder header contact | **UNCLEAR** — represents stature plus jump | GK/JUMP suggests normal elite contact is mostly lower; 2.5 m is exceptional but plausible |
| `HEADER_RADIUS` | 1.35 | m | Horizontal centre-to-ball header reach | **UNCLEAR** — combines run, lean and jump into one radius | Generous relative to static anatomy; **SCALE ALERT** |
| `CHEST_TRAP_MAX_HEIGHT` | 1.7 | m | Highest chest/thigh control | **UNCLEAR** — depends strongly on stature | Plausible for adult players |
| `CHEST_TRAP_RADIUS` | 1.05 | m | Horizontal chest-trap reach | **UNCLEAR** — represents positioning, not literal torso reach | Generous but plausible as a movement envelope |
| `CHEST_TRAP_MAX_VZ` | 1.5 | m/s upward | Rising-ball trap gate | **UNCLEAR** — technique-dependent, no standard cutoff | No defensible published threshold |
| `GK_CLAIM_HEIGHT` | 2.55 | m | Highest keeper catch/save contact | **UNCLEAR** — stature, arm reach, jump and dive combined | GK/JUMP makes 2.4–2.8 m broadly plausible |
| `GK_HOLD_CLEARANCE` | 3 | m | Pushes opponents away from held keeper | **DESIGNED** — Laws prohibit challenge but prescribe no radius | Not law-anchored |
| `RESTART_CLEARANCE` | 6 | m | Generic kick-in/goal-kick clearance circle | **DESIGNED** — house-rule compromise | Real references vary: throw-in 2 m, free kick 9.15 m |
| `CORNER_CLEARANCE` | 9.15 | m | Corner and free-kick defender distance | **ANCHORED** — exact IFAB distance | Exact raw law; **SCALE ALERT:** 43% oversized relative to ×0.7 similarity |
| `PENALTY_SPOT_DIST` | 6.552 | m | Penalty mark from goal line | **DESIGNED** — `BOX_DEPTH × 0.72`, not law-derived | LAW-GEO ×0.7 target 7.7 m: **OUTSIDE −14.9%** |
| `PENALTY_CLEARANCE` | 8 | m | All non-taker/non-GK penalty setup clearance | **UNCLEAR** — partly law-like but inconsistent with both scaling conventions | Law is 9.15 m; scaled analogue 6.405 m. Value is 12.6% low raw and 24.9% high scaled |
| `RESTART_MIN_SETUP` | 1 | s | Minimum generic dead-ball setup | **DESIGNED** — pacing | No generic law minimum |
| `RESTART_TIMEOUT` | 6 | s | Failsafe forced restart | **DESIGNED** — anti-stall mechanism | Comparable to newer five/eight-second protocols only loosely |
| `CONTROL_RADIUS` | 1.25 | m centre-to-ball | Free-ball contact/control envelope | **UNCLEAR** — physical reach plus locomotion collapsed into one radius | Large for routine foot control; plausible only as an extended lunge. **SCALE ALERT** |
| `BALL_ACCESS_SIDE_EXTENSION_FACTOR` | 1 | ratio | Full side-sector leg extension | **DESIGNED** — oriented contact-shell rule | No external constant |
| `BALL_ACCESS_BACK_EXTENSION_FACTOR` | 0.9 | ratio | Rear-sector extension | **DESIGNED** — allows near-full back-heel reach | No external constant |
| `CONTEST_RADIUS` | 3 | m | Loose-ball contest classification | **DESIGNED** — telemetry/classification boundary | Not currently the physical duel radius |
| `CONTROL_MAX_SPEED` | 14 | m/s | Max surprise/bystander capture speed | **UNCLEAR** — hard cutoff on a continuous control problem | Inside BALL-TRACK range; intended targets separately receive a 24 m/s override |
| `GK_CONTROL_MAX_SPEED` | 23 | m/s | Keeper capture speed limit | **UNCLEAR** — hard handling threshold | Near top of pass range and below maximal-shot range; plausible but not a real cliff |
| `CONTACT_CONTROL_DELAY_TICKS` | 3 = 0.05 s | ticks/s | Contact-to-possession separation | **DESIGNED** — substrate arbitration window | Much longer than ball-foot impact, shorter than human reaction; not meant as either |
| `CONTACT_COMMIT_TIME` | 0.08 | s | Minimum post-contact commitment | **DESIGNED** — prevents immediate competing claim | No direct anchor |
| `CONTACT_CONTROL_RETENTION_MARGIN` | 0.02 | m | Reach tolerance at delayed claim | **DESIGNED** — numerical/interaction hysteresis | No real counterpart |
| `CONTACT_RELEASE_MIN_SPEED` | 0.25 | m/s | Minimum normal ball separation after contact | **DESIGNED** — avoids a glued independent ball | No direct calibration |
| `CONTACT_RELEASE_MAX_SPEED` | 1.2 | m/s | Maximum normal release after cushioning | **DESIGNED** — caps touch rebound | Plausible touch speed; calibration absent |
| `CONTACT_RELEASE_INCOMING_SHARE` | 0.12 | ratio | Incoming normal speed retained | **DESIGNED** — contact response coefficient | No published football-specific constant |
| `CONTACT_TANGENTIAL_RETENTION` | 0.35 | ratio | Tangential motion retained at contact | **DESIGNED** — contact response coefficient | No published football-specific constant |
| `DEFLECT_MAX_SPEED` | 24 | m/s | Upper speed for pass deflection | **UNCLEAR** — leg contact remains possible above control pace | Just above BALL-TRACK pass range but below maximal shots; plausible |
| `KICK_COOLDOWN` | 0.45 | s | Re-capture ban after kick | **DESIGNED** — explicitly lets passes leave | Not a physiological kick-cycle measurement |
| `PASS_POWER_MIN` | 0.85 | ratio | Lowest intended pass weighting | **DESIGNED** — game input range | No direct real constant |
| `PASS_POWER_MAX` | 1.15 | ratio | Highest intended pass weighting | **DESIGNED** | No direct real constant |
| `PASS_POWER_NOISE_K` | 0.60 | σ coefficient | Error from non-neutral pass weighting | **DESIGNED** — attribute curve | Requires completion/error calibration |
| `PASS_POWER_EXECUTED_MIN` | 0.70 | ratio | Lower clamp on mis-hit power | **DESIGNED** — numerical sanity bound | No direct real anchor |
| `PASS_POWER_EXECUTED_MAX` | 1.30 | ratio | Upper clamp on mis-hit power | **DESIGNED** | No direct real anchor |
| `TOUCH_CONTROL_DIST` | 4.2 | m | Opponent distance above which open dribble touches occur | **DESIGNED** — carry-regime switch | No universal pressure distance |
| `TOUCH_PUSH_BASE` | 0.9 | m/s | Base ball speed added on open touch | **DESIGNED** — visible-touch pacing | Plausible small nudge |
| `TOUCH_PUSH_SPACE` | 0.32 | (m/s)/m | Added push speed per metre of open cone | **DESIGNED** — tuned knock-and-run gradient | No direct anchor |
| `TOUCH_RECOLLECT_BASE` | 0.26 | s | Minimum no-recapture interval after push | **DESIGNED** — poke/chase window | Roughly one running step, but not study-derived |
| `TOUCH_RECOLLECT_PER_PUSH` | 0.04 | s per m/s | Extra chase time with touch strength | **DESIGNED** | No direct anchor |
| `GK_RUSH_ENVELOPE` | 5 | m | Treats open grass near keeper as covered | **DESIGNED** — tactical abstraction | Plausible one-second coverage at GK running speed |
| `AI_INTERVAL` | 0.15 | s | Individual action re-evaluation | **UNCLEAR** — resembles perception/decision latency but is actually a scheduler | REACTION ≈0.20 s even before movement: **POTENTIALLY OUTSIDE fast** |
| `TEAM_AI_INTERVAL` | 0.4 | s | Tactical-mode/assignment refresh | **UNCLEAR** — complex collective decision proxy | Plausible versus complex choice latency; no direct team-level anchor |
| `SHOT_SPEED` | 27 | m/s | Open-play foot-shot launch speed | **ANCHORED** — squarely inside elite shot measurements | KICK 25–35 m/s; raw value plausible. **SCALE ALERT** for shortened shot distance |
| `PLAYER_MIN_DIST` | 1.05 | m centre-to-centre | Hard player separation | **DESIGNED** — collision/crowding rule | Far wider than literal torso collision; **SCALE ALERT** |
| `PLAYER_CORE_RADIUS` | 0.525 | m | Stable kinematic body disc | **DESIGNED** — half the hard separation | Diameter 1.05 m exceeds adult shoulder/torso breadth; intentionally abstract |
| `BALL_RADIUS` | 0.11 | m | Physical ball radius for geometry/rendering | **ANCHORED** — size-5 ball | LAW-BALL 0.108–0.111 m; excellent match |

## `src/sim/mechanics.ts`

Grouped rows represent coherent inline parameter sets rather than every arithmetic zero or numerical guard.

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| `keeperReach` | `2.05 + 0.4 aggression + 0.5(reflex−0.5) + 0.12 cat` m; total about 1.80–2.82 m | Horizontal save/claim reach | **UNCLEAR** — physical reach and dive displacement are collapsed into one radius | Broadly plausible for adult GKs, but no dive-time dependence |
| `SAVE_STRETCH` | 1.35× reach | Fingertip save-attempt envelope | **DESIGNED** — explicitly engineered from sim 1v1 probes | Extends possible contact to about 2.43–3.81 m; external validation needed |
| Dive difficulty | baseline 1.15; floor 0.25; 40 m path | Save probability discount from line offset | **DESIGNED** — outcome model | No standalone physical constant |
| Angle coverage | line-offset scale 3 m | Keeper’s shot-cone coverage | **DESIGNED** — geometric save modifier | Real concept, but 3 m scale is not sourced |
| Orientation noise | `1 + misalign(0.9−0.6 technique)` | Across-body kick error | **DESIGNED** — attribute-response curve | Biomechanically sensible direction, unanchored magnitude |
| Orientation power loss | up to `0.22(1−0.4 technique)` | Across/back-body kick power | **DESIGNED** | No cited percentage anchor |
| `TOUCH_SPEED_COST.base` | speed span 8 m/s, weight 0.07; starts at 6 m/s and saturates at 14 | Ordinary first-touch failure | **DESIGNED** — documented shipped curve | Pass speeds are real, failure probabilities are not externally calibrated |
| `TOUCH_SPEED_COST.heavy` | span 16 m/s, weight 0.24; saturation at 22 | Experimental heavy-touch curve | **DESIGNED** — explicitly probe-selected | Upper endpoint matches BALL-TRACK |
| First-touch formula | base 1%; pressure +10 pp; blind +5 pp; technique factor 0.45–1.3; cap 40% | Miscontrol probability | **DESIGNED** — multi-factor outcome curve | Requires event/tracking calibration |
| Failed-touch response | ±0.8 rad; 3.5–6.5 m/s; 0.5 s cooldown | Loose-ball direction, speed and recovery | **DESIGNED** | Speeds plausible for a heavy touch |
| Offside epsilon | 0.2 m | Treats level within 20 cm as onside | **DESIGNED** — deterministic tolerance | IFAB has no 20 cm tolerance; explicit house deviation |
| Third-man recognition | 1.5 s, target >3 m ahead | Pass-pattern bookkeeping | **DESIGNED** | Tactical definition, not physics |
| One-touch noise multiplier | `1.15 + 0.9(1−dribbling)` = 1.15–2.05× | First-time pass error | **DESIGNED** | No direct empirical multiplier |
| `shotQuality` | `0.85 exp(−d/10)`; lateral −50%; pressure −30%; clamp 0.01–0.8 | Pre-shot xG | **DESIGNED** — deliberately simple outcome model | XG uses learned distance, angle, body part and context; the 10 m e-fold is not externally fitted |
| Ground-bend detection | 1.3 m lane threshold; 2 m endpoint exclusions | Whether through ball curves around a defender | **DESIGNED** — tactical geometry | No real fixed trigger |
| Ground curvature | 0.135–0.45 rad/s heading-rotation rate | Curled ground-pass path | **DESIGNED** — this is trajectory rotation, not physical ball spin | Cannot compare to ball rpm |
| Curled-pass weight error | `0.2 × curvature × (1.35−passing)` | Bend execution error | **DESIGNED** | No external anchor |
| Ground-pass lead | reference 16 m/s; 0.8 of projected receiver motion | Target point | **DESIGNED** | Reference speed is plausible; 0.8 lead fraction is tactical |
| Ground-pass speed envelope | `clamp(0.6d+8.2, 9, 22)` m/s | Ordinary pass launch | **ANCHORED** for the envelope; formula itself is designed | BALL-TRACK 7.9–22.3 and experienced side-foot 21.4 ±1.5: plausible |
| Ground-pass angular noise | `0.02 + 0.07 pressure + 0.0015d`, then style/skill multipliers | Pass accuracy | **DESIGNED** | Needs completion and endpoint-error data |
| Give-and-go gate | under 15 m; pressure >0.2; stamina >0.3; score >0.35; window 2.3 s | Wall-run activation | **DESIGNED** — tactical pattern timing | No single real anchor |
| Ground through-ball lead/speed | 18 m/s reference; 1.25× run lead; `10–24` m/s | Through-ball meeting point and pace | **UNCLEAR** — upper end exceeds typical pass validation but remains below hard shots | 24 m/s is slightly beyond BALL-TRACK and roughly a hard driven kick; not clearly outside |
| Lofted through-ball flight | `0.55 + 0.045d`, clamped 0.8–2.0 s | Chip-through hang time | **UNCLEAR** — real measurable, but delivery-dependent | Plausible range; no dataset-backed distance curve |
| Generic loft noise/range | angular base 0.03 rad; pressure 0.05; distance 0.0011/m; range error `0.02+0.0008d` | Loft accuracy | **DESIGNED** | No external calibration |
| Cross flight | `0.5 + 0.038d`, clamped 0.7–1.7 s | Cross hang time | **UNCLEAR** — plausible but not study-fitted | Typical visual range is plausible; aerodynamic drag is omitted |
| Cross goal pull | 0.18 | Pulls landing point toward goal | **DESIGNED** | Tactical choice |
| Cross curvature | 0.28–0.58 rad/s path rotation | Inswing | **DESIGNED** | Not physical spin rate |
| Keeper-throw flight | `0.62 + 0.03d`, clamped 0.9–1.5 s; lead 0.7; noise ×0.45 | Overarm distribution | **UNCLEAR** — physically interpretable but unsourced | Plausible for 8–30 m distribution |
| Cutback lead/speed | 18 m/s reference; 0.8 lead; `11–23` m/s | Driven pull-back | **UNCLEAR** — 23 m/s is at/just above maximal side-foot pass evidence | Aggressive but still within hard-kick plausibility |
| Aerial swing | defender considered inside 8 m; curvature 0.12–0.30 rad/s | Lofted switch bend | **DESIGNED** | Tactical abstraction |
| Lofted-switch flight | `0.55 + 0.033d`, clamped 1.1–2.1 s; lead 0.7 | Long diagonal trajectory | **UNCLEAR** | Plausible hang-time range; no drag makes long flights optimistic |
| `AERIAL_ROLE` | GK 0, DF .30, MF .14, WG .06, ST .26 | Header-duel role prior | **DESIGNED** | Explicit role balance |
| GK aerial radius | 1.9 m | Keeper eligible to claim high ball | **UNCLEAR** — static horizontal reach plus movement | Generous without time-to-arrival; plausible for a dive/step |
| GK aerial claim chance | `0.62 + 0.5(reflex−.5) − .3 crowd`; clamp .2–.9 | Cross collection | **DESIGNED** | Needs claim/punch event calibration |
| Header duel score | attack +0.3; proximity up to .35; RNG 0–.45 | Aerial winner | **DESIGNED** | Explicitly tuned game outcome |
| Header decision zones | shot inside 16.5 m; defensive clear inside 20 m | Header action selection | **DESIGNED** | 16.5 m borrows box depth but the sim box is only 9.1 m deep |
| Defensive-header velocity | 11–15 m/s horizontal; 3.5–5.2 m/s vertical | Header clearance | **UNCLEAR** | Incoming header-study speeds commonly 9–15 m/s; outgoing values need validation |
| Knockdown velocity | 7–9.5 m/s; `vz=0.8` | Header pass | **UNCLEAR** | Rather fast for a cushioned knockdown, but plausible for a firm header |
| Chest-trap spill | +5 pp failure; cap 50%; 3–5.5 m/s spill; 0.3 s commitment | Aerial first touch | **DESIGNED** | Outcome calibration absent |
| Headed-shot velocity | 15–19 m/s; downward `vz=−1.2` | Shot from header | **UNCLEAR** — material physical speed | Above many studied incoming-heading speeds; outgoing shot evidence is insufficient to mark outside |
| Header-shot xG | `0.5 exp(−d/8.5)`; cap .45 | Header chance quality | **DESIGNED** | Real xG distinguishes body part; this curve is not data-fitted |
| Chip feasibility | 7–30 m shot; keeper 2.5 m ahead and 5.5 m before goal; within 3.5 m of chord; ≥7.5 m off line; hang ≤1.45 s | Whether a chip is attempted | **DESIGNED** | Tactical spectacle gate |
| Ground-shot aim margin | `max(.4, 1.3−.6 finishing−.1 clinical)` m | Corner placement | **DESIGNED** | No external placement distribution |
| Ground-shot spread | `0.022 + .0028d + .05 contest`, skill/style multipliers | Shot accuracy | **DESIGNED** | Should ultimately be checked against post-shot xG/placement data |
| Shot curvature | 0.1–0.3 rad/s path rotation | Placed curler | **DESIGNED** | Not physical spin rate |
| Free-kick arrival height | 0.85–2.75 m | Under-/over-bar distribution | **DESIGNED** | Physically plausible |
| Free-kick wall clearance | `2.6 + 0.5 spin` m | Clears wall/header band | **DESIGNED** | Deliberately guarantees roughly 2.73–2.85 m clearance, unusually high for every successful solver |
| Free-kick flight | 0.9–1.9 s | Direct-FK trajectory | **UNCLEAR** | Plausible for common direct-FK distances |
| Free-kick xG | `0.09−.003(d−17)`, clamp .02–.12 | Set-piece chance value | **ANCHORED** at population scale | FK-RATE 4.72% lies inside the range, though distance curve remains designed |
| Dribble cone | 14 m range; approximately 70° cone; open-space cap 9 m | Size of open grass influencing push | **DESIGNED** | Tactical abstraction |
| Dribble-touch ball speed | carrier speed plus at least 0.8 m/s | Open carry touch | **DESIGNED** | Plausible construction, but should be checked against touch cadence/distance |
| Dribble-touch noise | `0.07(1.35−0.7 dribbling)` rad | Heavy-touch direction | **DESIGNED** | No external endpoint-error anchor |
| Dribble-touch ownership window | 1.6 s | Associates free ball with prior carrier | **DESIGNED** | Bookkeeping/tactical window |
| Clearance velocity | up to 23 m/s horizontal; 3.2–5.4 m/s vertical | Panic clearance | **ANCHORED** for total kick magnitude | Near maximal side-foot/hard-pass speeds and below strong shots |
| Deflection chance | `0.24 + .4 defending − .02(speed−14)`; clamp .05–.6 | Interception stretch success | **DESIGNED** | Requires event-rate and orientation calibration |
| Deflection output | ±1.2 rad; 4–8 m/s | Ricochet | **DESIGNED** | Plausible loose-ball speed |
| Smother radius | 1.3 m | Keeper-at-feet challenge | **UNCLEAR** — physical dive/lunge envelope | Generous static radius but plausible at speed |
| Smother success | base .56; reflex +.5; dribbler −.35; clamp .2–.85 | Keeper 1v1 outcome | **DESIGNED** | Requires real 1v1 outcome data |
| Recovery-slide reach | 1.2–2.2 m | From-behind slide eligibility | **UNCLEAR** — physical lunge distance | Plausible for a full slide, but instantaneous eligibility ignores time-to-contact |
| Slide-tackle attempt/win | attempt .05–.17; win base .16, clamp .05–.4; foul .4–.55 | Recovery tackle outcomes | **DESIGNED** | Needs tackle/foul census |
| Tactical-foul geometry | 16–34 m from goal; sprint ≥4.5 m/s; grab radius 1.7 m | Professional-foul opportunity | **DESIGNED** | Tactical abstraction |
| Standing tackle radius | 1.15 m | Normal tackle eligibility | **UNCLEAR** — foot/lunge reach | Plausible extended-leg envelope; large relative to compressed pitch |
| Standing tackle probability | base .25; clamp .06–.7 plus attributes/context | Ball-winning chance | **DESIGNED** | Needs real and sim duel calibration |
| Shot-block shell | height ≤1.1 m; radius .9 m; excludes final 6 m | Defender block eligibility | **UNCLEAR** for geometry | Height/radius plausible for legs/body; 6 m goalmouth exclusion is designed |
| Shot-block probability | `.32 + .25 defending`, readiness-scaled | Successful block | **DESIGNED** | Real block frequency is context-dependent |
| Keeper save gate | ball ≥6 m/s and ≤2.55 m high | Whether save logic runs | **DESIGNED/UNCLEAR** — physical thresholds but implementation gates | Slow shots rely on capture logic rather than saves |
| Keeper save curves | open base .48, xG slope −.45, reflex swing ±.14; placed base .70; caps .10/.92 | Save probability | **DESIGNED** | Outcome model should be checked against post-shot xG, not pre-shot xG alone |
| Catch threshold/chance | speed <21 m/s and 80% chance | Catch versus parry | **UNCLEAR** — handling depends on placement, spin and body position, not only speed | 21 m/s is a hard pass/medium shot; plausible threshold, unrealistic cliff |
| Parry response | 45% incoming speed, clamp 7–12 m/s; angle 0.55–1.15 rad | Saved-shot rebound | **DESIGNED** | No external calibration |

## `src/sim/Ball.ts`

| Numeric item | Value | What it governs | Class and reasoning | Anchor |
|---|---:|---|---|---|
| State initialisers/reset values | 0 | Position, velocity, height, spin and ownership reset | **DESIGNED** — neutral state, not a play parameter | No audit concern |
| `radius` | delegates to `BALL_RADIUS` = 0.11 m | Physical ball geometry | **ANCHORED** | See LAW-BALL and the `constants.ts` row |

There are no independent play-shaping inline numeric literals in this file.

## `src/sim/Player.ts`

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| `BASE_SPEED.GK` | 6.4 m/s | Keeper role baseline | **ANCHORED** — plausible role-specific top speed | Below outfielder peaks, consistent with GK role |
| `BASE_SPEED.DF` | 7.0 m/s | Defender baseline | **ANCHORED** | Pace attributes raise it to 7.84 m/s; plausible |
| `BASE_SPEED.MF` | 7.3 m/s | Midfielder baseline | **ANCHORED** | Maximum 8.18 m/s; plausible |
| `BASE_SPEED.WG` | 7.9 m/s | Winger baseline | **ANCHORED** | Maximum 8.85 m/s; matches RUN 8.1–9.1 |
| `BASE_SPEED.ST` | 7.7 m/s | Striker baseline | **ANCHORED** | Maximum 8.62 m/s; plausible |
| `ACCEL` | 14 m/s² | Velocity convergence toward desired motion | **UNCLEAR** — expressed as physical acceleration but likely compresses responsiveness | ACCEL 3.3–8.7; even ×1/0.7 similarity gives about 4.7–12.4: **OUTSIDE high** |
| `TURN_RATE` | 6.5 rad/s | Body facing rotation; 180° in 0.48 s | **UNCLEAR** — physically interpretable but not equivalent to a full change-of-direction test | Likely very agile; no clean study comparator |
| Pace multiplier | `0.88 + 0.24 pace` | ±12% role top-speed range | **DESIGNED** — attribute mapping | Resulting top speeds remain plausible |
| Acceleration multiplier | `0.9 + 0.2 pace` | 12.6–15.4 m/s² | **DESIGNED** mapping around an **UNCLEAR** base | Entire range remains above scaled theoretical elite upper values |
| Engine stamina multiplier | 0.9 | 10% slower drain | **DESIGNED** | Trait reward |
| Knock penalties | pace ×0.8; dribbling ×0.85 | Injury degradation | **DESIGNED** | No injury-severity mapping |
| Fatigue speed curve | `0.62 + 0.38 stamina` | Top speed under fatigue | **DESIGNED** — energy-economy choice | At typical stated end stamina 0.6–0.8, speed falls 7.6–15.2%, larger than ordinary match fatigue effects |
| Stun movement multiplier | 0.15 | Stumble/ground recovery motion | **DESIGNED** | Animation/gameplay state |
| Heading activation speed | 0.5 m/s | Only update facing from velocity above threshold | **DESIGNED** | Numerical stability/visual choice |
| Drain effort threshold | 0.55 of base speed | Switches recovery to quadratic drain | **DESIGNED** | Physiology is continuous, but threshold is gameplay economy |
| Minimum stamina | 0.05 | Prevents complete exhaustion | **DESIGNED** | Safety floor |

Raw top speeds are strong. The principal mismatch is acceleration: players reach those speeds much too quickly.

## `src/ai/prediction.ts`

The requested `src/sim/prediction.ts` does not exist. The live file is `src/ai/prediction.ts`.

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| Observation horizon | default/max 1.5 s | Constant-velocity player projection | **DESIGNED** — AI forecast horizon | Long enough that turns and accelerations make constant velocity unreliable |
| Power floor | 0.1× | Prevents non-positive pass power | **DESIGNED** — numerical guard | Not reached by normal 0.85–1.15 power range |
| Pass lead model | distance divided by `16 × power`; receiver motion ×0.8 | Predicted target point | **DESIGNED** | Mirrors mechanics exactly; 16 m/s is plausible but fixed |
| Launch formula | `clamp(0.6d+8.2, 9, 22) × power` m/s | Predicted ground-pass speed | **ANCHORED** for bounds | BALL-TRACK and experienced side-foot speeds support 9–22 m/s |
| Fixed-step arrival rounding | ceil to `DT`; epsilon `1e−12` | First engine tick reaching distance | **DESIGNED** — numerical fidelity | Correctly mirrors the deterministic integrator |
| Friction reachability | finite maximum `speed·DT/(1−exp(−kDT))` | Whether a pass can reach its point | **UNCLEAR** because inherited from `BALL_FRICTION_K` | Same high-speed braking concern as the runtime physics |

## Ranked shortlist: constants most deserving realism scrutiny

1. **`ACCEL = 14 m/s²`**  
   It controls separation, pressing, recovery and keeper rushes. The resulting 12.6–15.4 m/s² player range exceeds measured and theoretical elite-football values even after granting the 0.7 field-compression allowance.

2. **`BALL_FRICTION_K = 0.55 s⁻¹`**  
   It governs every ground pass and dribble push. Overall low-speed roll-out can look plausible, but the exponential form produces excessive braking at hard-pass speeds and differs from published turf behaviour.

3. **`CONTROL_RADIUS = 1.25 m`**  
   This is a very large centre-to-ball interaction shell, remains unscaled on the compressed pitch, and feeds control, interceptions and loose-ball contests. Small changes could alter possession ecology everywhere.

4. **`SPEED_TIME_SCALE = 1`**  
   It documents the decision to retain real raw speeds on a 0.7 pitch, creating 43% faster pitch-relative transit—and it currently has no runtime consumer. This is the global spatial/temporal realism coupling.

5. **`BOX_WIDTH = 19.6 m`**  
   It is 30.6% narrower than a true ×0.7 penalty area. Together with `BOX_DEPTH`, it changes keeper handling, penalties, shot zones, defensive shape and aerial decisions, so this is more than cosmetic scaling.

6. **`AI_INTERVAL = 0.15 s`**  
   It is faster than the roughly 0.20 s lower bound commonly used for post-stimulus human reaction, before decision and movement time. Because it is a scheduler rather than explicit reaction latency, its effective consequences need tracing.

7. **`PLAYER_MIN_DIST = 1.05 m`**  
   The hard separation diameter is much larger than literal body breadth and is unscaled. In 6v6 it materially determines block density, pressing lanes, screening and whether multiple players can contest the same ball.

8. **`BALL_BOUNCE = 0.45`**  
   It gives only about 0.405 m rebound from a 2 m drop, below FIFA-quality turf’s 0.60–0.85 m band. It will make lofted balls settle early and suppress second-bounce/aerial chaos.

9. **Inline `SAVE_STRETCH = 1.35`**  
   It expands keeper attempt reach by 35%, potentially to nearly 3.8 m, and was tuned from sim goal anatomy rather than external dive-time/reach evidence. It directly governs whether a shot receives any save roll.

10. **Inline `shotQuality` distance scale `exp(−d/10)`**  
    This single 10 m e-fold drives xG, keeper saves and evolutionary shot selection. Real xG is learned from distance, angle, body part, assist type and defender/GK context; this compact curve therefore has unusually large systemic leverage.