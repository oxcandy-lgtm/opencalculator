# Open Calculator

## A Globally Shared Authoritative Calculator with Event-Sourced Ownership, GPT-5.6 Canonization, CCL Evidence, and Experimental SAI EpochCast Coherence

**Document status:** public design paper  
**Project status:** implementation and experimental validation in progress  
**Date:** 2026-07-16

---

## Abstract

The electronic calculator has spent decades as a single-user machine that maps private input to an immediate result. Open Calculator reinterprets that familiar surface as a globally shared authoritative state machine. Every accepted keypress modifies one public expression. Any player may spend the in-game unit `seg` to press `=`. Exactly one valid Equal transaction evaluates the current expression, debits the winning player, mints the result as a persistent number card, and resets the round atomically. Competing stale Equal attempts are rejected without charge.

This simple rule creates a timing game, a collectible economy, and a distributed-systems laboratory. Players may claim a small safe result or wait for a larger, patterned, mathematically unusual, or culturally meaningful number while risking that another player claims it first. Cards preserve their formula, event history, deterministic mathematical evidence, catalog edition, ownership transition, and replay commitments. GPT-5.6 provides schema-constrained canonization: names, descriptions, semantic tags, cultural readings, and cult interpretations. It is deliberately excluded from balances, evaluation, rarity mathematics, ownership, editions, and settlement.

The production baseline is an event-sourced authoritative state machine with a safe parser, atomic Equal transaction, idempotency, deterministic replay, and an inspectable X-RAY mode. CCL — Causal Context Ledger — records canonical facts, experiments, failed tests, superseded decisions, and quarantined claims. A separate research contribution, SAI EpochCast Coherence Protocol, proposes a two-lane communication architecture in which active users interact over a low-latency path while spectators consume committed epochs from an append-only stream. EpochCast is published as an ambitious falsifiable hypothesis, not as a proven scaling result.

The project’s central product claim is that a calculator can become a social world without losing the clarity of a calculator. Its central engineering claim is narrower: state transitions, ownership, machine interpretation, and public history can be made deterministic, replayable, and inspectable even under contested global input.

---

## 1. Introduction

A calculator normally hides almost every interesting systems problem. There is one user, one device, one expression, and one result. No one disputes input order. No economic ownership is created. History can be discarded. A wrong result is a local failure.

Open Calculator changes only one premise: the calculator is shared.

Once every participant touches the same expression, ordinary keys become concurrent commands. An operator arriving before a digit can change validity. A deletion can destroy another player’s plan. A result can become valuable because of its magnitude, pattern, formula, edition, or cultural associations. The `=` key becomes a settlement operation because it assigns ownership and charges currency.

The familiar interface becomes a direct representation of hidden infrastructure:

- ordering becomes visible as arithmetic syntax;
- concurrency becomes visible as contested input;
- settlement becomes visible as `=`;
- event sourcing becomes visible as Replay Birth;
- model interpretation becomes visible as card canonization;
- distributed consistency becomes visible as one shared display;
- failure becomes visible because the expression, owner, or balance would be wrong.

The project deliberately keeps the surface small. Complexity is not demonstrated through a dashboard full of controls. It is demonstrated by allowing the user to open X-RAY mode and inspect the machinery underneath a calculator that still behaves like a calculator.

---

## 2. Research and product questions

Open Calculator investigates several questions at once.

### 2.1 Product question

Can a globally shared utility interface become a compelling game through timing, scarcity, ownership, social interpretation, and collection rather than through conventional combat or movement?

### 2.2 Systems question

Can one authoritative public expression accept contested input, settle one winner, and preserve deterministic replay without duplicate charges, mints, or editions?

### 2.3 AI question

Can a frontier language model add semantic and cultural meaning to deterministic objects without being trusted with financial or authoritative state?

### 2.4 Communication question

Can authority be separated from audience delivery so that spectator growth does not force the semantic sequencer to perform direct work for every observer?

### 2.5 Epistemic question

Can a public project preserve the difference between current fact, experiment, rejected idea, unverified performance target, and superseded design instead of allowing documentation to blur them?

---

## 3. The shared calculator

### 3.1 One expression

A room has one canonical round and one canonical expression. Every accepted command is assigned a global sequence and applied in that order.

The initial command surface may include:

```text
0 1 2 3 4 5 6 7 8 9
+ - × ÷
( )
decimal point
backspace
clear under restricted rules
=
```

The exact operator set is versioned because evaluator semantics must never change invisibly for historical cards.

### 3.2 Immediate participation

Open Calculator does not use voting to decide which key should be applied. Valid accepted input affects the shared expression according to the authoritative ordering rule. This makes the system fast, chaotic, and legible.

### 3.3 Claiming with Equal

Any eligible player may attempt `=`. The attempt includes a round observation, state observation, idempotency key, and optional maximum fee constraint. The first valid current Equal in authoritative order can win.

A successful transaction:

1. establishes the exact expression cut;
2. verifies the current round and idempotency key;
3. calculates Equal Margin;
4. verifies sufficient `seg`;
5. safely evaluates the expression;
6. derives deterministic card evidence;
7. allocates a Unique catalog edition when applicable;
8. debits the player;
9. mints the card;
10. appends the event and outbox evidence;
11. resets the expression into a new round;
12. commits atomically.

A later Equal that observed the old round is stale. It receives no card and pays no fee.

### 3.4 The timing game

The player faces a simple decision:

- press early and secure a low-value result;
- wait while others extend the expression;
- spend more Equal Margin for a stronger candidate;
- risk another player pressing first;
- risk invalidation or a timed reset.

A provisional pressure mechanism clears an unclaimed high-opportunity expression after a short inactivity window, initially imagined as approximately five seconds. The exact trigger must be carefully specified so the system does not punish normal network delay or create hidden regional advantage.

---

## 4. Economy: seg and Equal Margin

### 4.1 seg

The unit `seg` is named after seven-segment displays. It is both a game currency and a thematic representation of the physical cost of displaying numbers.

Potential sources include:

- login or participation grants;
- system sale of low-value cards;
- Segmentization;
- player marketplace settlement;
- bounded rewards for verified contribution;
- seasonal or event rewards.

Any grant system must resist automated farming and sybil amplification.

### 4.2 Equal Margin

Equal Margin is the fee required to claim the current expression. It should be deterministic and observable before a player confirms `=`.

Candidate inputs include:

- result magnitude or estimated logarithm;
- digit count;
- expression depth;
- expensive operations;
- deterministic rarity evidence;
- current round pressure;
- anti-spam floor;
- player-provided maximum fee.

A provisional form may be:

```text
margin = base
       + magnitudeComponent
       + structureComponent
       + operationRiskComponent
       + congestionComponent
```

The coefficients are not canonical until calibrated against real play. Near extremely large named values, Equal Margin should become correspondingly severe. The system should not allow a cheap claim merely because the evaluator can represent a huge number.

### 4.3 Seven-segment material score

The count of lit segments for decimal digits is:

```text
0:6  1:2  2:5  3:5  4:4
5:5  6:6  7:3  8:7  9:6
```

This can produce a material score distinct from rarity and cultural meaning. A card rich in `8` costs more visual material than a card rich in `1`. The contrast supports cult identity: a digit can be spiritually powerful while materially light.

### 4.4 Anti-spam sink

Dust and Common cards are not intended for free listing on the public marketplace. They can be sold to the system or Segmentized at a discount. Because Equal Margin is paid before minting, repeated low-value claims should have negative expected value.

This is not sufficient alone. Rate limits, account age, bounded grants, and anomaly detection may still be necessary.

---

## 5. Number cards

### 5.1 Card record

A card is a persistent, replayable artifact.

```text
NumberCard {
  card_id
  round_id
  result_representation
  expression
  evaluator_version
  minter_ref
  minted_at
  equal_margin_paid
  deterministic_score
  rarity
  feature_evidence
  contributor_refs[]
  cult_evidence
  unique_catalog_id?
  unique_edition?
  event_range
  epoch_roots[]
  pre_state_hash
  post_state_hash
  canonization?
  proof_of_birth_status
}
```

### 5.2 Deterministic features

Possible features include:

- magnitude;
- integer and fractional digit counts;
- repeated digits;
- run length;
- palindrome;
- ascending or descending sequence;
- periodic pattern;
- prime or probable-prime status within bounded rules;
- perfect square, cube, or power;
- factorial relationship;
- known constants within an explicit registry;
- seven-segment material score;
- expression complexity;
- contributor count;
- edition-number features;
- formula-history features.

Expensive mathematical properties must have bounded algorithms and an explicit status such as `verified`, `probable`, `not_checked`, or `unsupported`.

### 5.3 Rarity

The working ladder is:

```text
Dust
Common
Rare
Epic
Legendary
Mythic
Unique
```

Rarity is derived by deterministic policy. GPT-5.6 may describe the result but may not promote the rarity.

A scoring system should avoid making digit count the only path to value. Otherwise the optimal strategy collapses into producing the largest representable number. Patterns, formula provenance, catalog meaning, edition, and cult interactions provide orthogonal value.

### 5.4 Unique registry

Unique means registry-recognized, not one-of-one.

Example:

```text
Catalog ID: U-009
Number: 123456789
Display seed: Most Popular Password
Rank: Unique
Edition: 37
Total issued at mint time: 37
```

The exact name and description may be canonized by GPT-5.6, but registry membership, catalog identifier, and edition allocation remain deterministic.

Edition numbers are part of value. A `7` cult may prefer edition `7`, `77`, or `777`; a constant-oriented collector may prefer `314`; other editions may acquire social meaning without official mechanical power.

### 5.5 Replay Birth

A card can replay the committed commands that produced it. Replay is not merely an animation; it verifies that the expression and result correspond to the event history and state commitments.

A complete Proof of Birth may be generated asynchronously after minting to avoid delaying ownership settlement.

---

## 6. Marketplace

The MVP marketplace can use fixed-price listings in `seg`.

Rules:

- Dust and Common are system-only;
- Rare and higher may be listed;
- listing creates a custody or lock record;
- purchase transfers `seg` and ownership atomically;
- a card cannot be listed twice;
- a sold or locked card cannot contribute simultaneously to conflicting inventory calculations;
- fees and cancellation policy are deterministic;
- marketplace text cannot override authoritative card data.

Auctions, lending, bundles, derivatives, and cross-season financialization are outside the first scope because each adds settlement and abuse complexity.

---

## 7. Cult system

### 7.1 Digit affiliation

A player chooses one digit from `0` through `9`, preferably fixed for a season. The choice is visible and socially meaningful.

Working identities include:

| Digit | Working identity |
|---:|---|
| 0 | Null Order |
| 1 | Order of One |
| 2 | Twin Sect |
| 3 | Trinity Choir |
| 4 | Square Mason |
| 5 | Pentacle Guild |
| 6 | Hex Covenant |
| 7 | Lucky Church |
| 8 | Infinity Bank |
| 9 | Nine Cult |

Names are mutable presentation. The important rule is that official mechanics do not dictate one final meaning for a digit. Players and model canonization can produce competing interpretations.

### 7.2 Cult points

A card may contribute cult points through:

- occurrence count of the affiliated digit;
- position and run structure;
- digit presence in edition number;
- digit presence in formula history;
- sacred level history;
- seven-segment relationships;
- deterministic card features;
- seasonal modifiers.

The formula must be inspectable and versioned.

### 7.3 Dynamic roles

Cult rankings create asymmetric social roles.

- **Ranks 1–3:** dominant cults, competing for Cult Lord and top score.
- **Ranks 4–9:** Farmers, receiving stronger economics for Dust/Common conversion.
- **Rank 10:** Inquisitor; its digit becomes the heresy digit.

Roles should update on a fixed cadence such as daily settlement or season checkpoints, not continuously after every card. Fixed settlement reduces feedback instability and allows players to understand the current rules.

### 7.4 Heresy counterbalance

Cards held by dominant cults can lose score when they contain the current heresy digit. The weakest cult therefore becomes poisonous to the strongest.

This mechanic creates a negative feedback loop:

- dominance increases exposure;
- the lowest cult gains a disruptive identity;
- collectors may value contaminated cards differently;
- top cults cannot optimize only for their own digit.

The penalty must be capped and simulated to avoid an unstoppable oscillation or deliberate rank manipulation.

### 7.5 Cult Lord

Within each cult, players compete through stable card and progression evidence. A Cult Lord title can be seasonal, allowing history without permanent lock-in.

---

## 8. Level and meaningless statistics

### 8.1 Peak-faith level

Level is derived from historical peak inventory faith, not current inventory value. Selling a card does not reduce level.

A provisional curve is:

```text
requiredFaith(level) = 100 × (level^2.4 − 1)
level(peakFaith) = floor((peakFaith / 100 + 1)^(1 / 2.4))
```

This is a design seed, not a final balance claim.

### 8.2 Lending resistance

A peak system is vulnerable to temporary card transfer. Candidate mitigations include:

- a settlement delay before inventory contributes;
- gradual contribution at six, twelve, and twenty-four hours;
- one-time provenance restrictions;
- contribution caps for recently acquired cards;
- market-based lock periods.

The mechanism must not make normal buying feel broken. The simplest understandable rule should be preferred.

### 8.3 Sacred levels

A player may value levels containing the cult digit. Because level only rises, passing a sacred level could otherwise feel like losing it. The system therefore records sacred levels reached permanently.

### 8.4 Statistics without combat power

Level-ups grant points to fields such as:

```text
ATK DEF VIT AGI LUK INT FAI HER
```

These numbers intentionally do not create ordinary combat advantages. Their patterns may contribute to profile aesthetics, cult symbolism, or social scoring.

This design is not accidental satire. It tests whether users can create durable meaning from numerical arrangement even when the system explicitly denies conventional utility.

---

## 9. Authoritative state machine

### 9.1 State

A minimal room state includes:

```text
RoomState {
  protocol_version
  round_id
  expression_ast_or_tokens
  expression_display
  global_sequence
  state_hash
  last_epoch_root?
  idempotency_window
  equal_margin_preview
  reset_deadline?
}
```

Economic state includes balances, cards, registry editions, listings, and settlement records.

### 9.2 Commands

Commands are versioned and canonically encoded. The same command and pre-state must produce the same result across replay implementations.

### 9.3 Event sourcing

Every accepted or materially rejected command produces an event or rejection evidence.

```text
Event {
  event_id
  sequence
  round_id
  command_id
  actor_ref
  operation
  decision
  reason?
  before_state_hash
  after_state_hash
  idempotency_key_hash
  committed_at
}
```

Secrets and personal identifiers are never part of public event evidence.

### 9.4 Hashing

State hashes require canonical serialization. A hash is useful only if independent implementations serialize the same logical state identically.

The hash chain provides tamper evidence and replay checkpoints. It does not replace authorization, transaction integrity, or mathematical validation.

---

## 10. Safe expression evaluation

### 10.1 No dynamic code execution

The evaluator must never use JavaScript `eval`, `Function`, shell execution, or an equivalent dynamic escape.

### 10.2 Parser

Input is transformed through:

```text
validated token
→ grammar parser
→ constrained AST
→ semantic validation
→ bounded evaluator
→ canonical result representation
```

### 10.3 Limits

The evaluator defines:

- maximum expression bytes;
- maximum token count;
- maximum AST nodes;
- maximum nesting depth;
- maximum exponent magnitude;
- maximum integer digits retained exactly;
- decimal precision and rounding mode;
- maximum evaluation time;
- maximum intermediate allocation;
- supported operator versions.

### 10.4 Numeric representation

Integers should use exact arithmetic within a configured bound. Decimal operations require an explicit decimal library or representation; binary floating-point behavior must not silently become historical truth.

For results beyond full retention limits, the system may preserve:

- sign;
- exact leading and trailing digits within policy;
- total digit count;
- logarithmic magnitude;
- expression and evaluator commitment;
- scientific representation;
- a status explaining that the full expansion was not materialized.

### 10.5 Error behavior

Division by zero, invalid syntax, unsupported operations, excessive complexity, overflow policy, and timeouts are deterministic error outcomes. An invalid result cannot mint a card or charge a successful Equal fee. A small anti-abuse request fee, if introduced, must be separately disclosed and cannot masquerade as a successful Equal charge.

---

## 11. Atomic Equal contract

The Equal transaction is the project’s primary correctness boundary.

Required properties:

- exactly one winner per round;
- no double debit;
- no duplicate card;
- no duplicate Unique edition;
- stale attempts pay nothing;
- invalid evaluation mints nothing;
- mint and reset cannot separate;
- replay derives the same result;
- outbox publication can recover after a crash.

A detailed contract appears in [Atomic Equal](../architecture/atomic-equal.md).

---

## 12. GPT-5.6 Number Canonization and Meaning Protocol

### 12.1 Role

The model transforms validated evidence into human-readable meaning. It does not decide truth that deterministic systems can decide.

### 12.2 Admission

A Canonization Admission Controller decides whether a card merits a model call. Dust and ordinary Common cards should normally receive deterministic labels only. Strong Rare, Epic, Legendary, Mythic, and Unique candidates may be admitted based on budget and evidence.

### 12.3 Evidence packet

```text
CanonEvidence {
  card_id
  result_representation
  expression
  deterministic_features
  registry_match?
  edition_features
  cult_context
  formula_history_summary
  allowed_reference_evidence[]
  uncertainty_flags[]
}
```

The evidence packet is data, not instructions. User-controlled strings are escaped or represented in typed fields to reduce prompt injection.

### 12.4 Structured output

```text
CanonProposal {
  schema_version
  display_name
  short_description
  semantic_tags[]
  mathematical_readings[]
  cultural_readings[]
  cult_interpretations[]
  evidence_references[]
  uncertainty
  prohibited_claims_detected[]
}
```

Schema compliance is necessary but not sufficient. A deterministic validator checks length, references, forbidden claims, consistency with evidence, and publication policy.

### 12.5 Canon commit

The project stores commitments to:

- model identifier;
- prompt template version;
- schema version;
- evidence hash;
- output hash;
- validation result;
- final accepted fields;
- superseded canon versions.

Canonization may be updated without rewriting the mathematical birth record. Presentation history remains auditable.

### 12.6 Optional Canon Council

A later Unique-only process may use specialized roles:

- mathematician;
- cultural archivist;
- skeptic;
- judge.

The council produces proposals and criticism. The deterministic admission and commit layer remains authoritative.

---

## 13. SAI EpochCast Coherence Protocol

The full standalone protocol is published at [SAI EpochCast Coherence Protocol](../research/sai-epochcast-coherence-protocol.md).

### 13.1 Motivation

A single authority should decide state, but it should not necessarily manage a direct connection or send operation for every spectator.

### 13.2 Thesis

> **The authority processes commitments, not audiences.**

### 13.3 Active lane

```text
Client → Gateway → Epoch Fold → Sequencer → Relay → Active Client
```

### 13.4 Spectator lane

```text
Sequencer → Transactional Outbox → Append-Only Stream
          → Cache-Friendly Reader → Spectator or Replay Tool
```

### 13.5 Main components

- active-only micro-epochs, initially around a 40 ms target;
- deterministic epoch ordering;
- ordered manifests and Merkle roots;
- incremental transition capsules;
- Equal Strong Path and explicit cut manifest;
- active relay topology;
- spectator coherence by offset;
- state-hash lane handoff;
- snapshots and recovery;
- forkable history;
- asynchronous Proof of Birth.

### 13.6 Truth boundary

EpochCast is not yet evidence that Open Calculator can serve a particular global population or achieve a particular cost. It is a protocol hypothesis with benchmark and promotion gates.

---

## 14. Candidate deployment architecture

A practical first implementation may use:

- a static web application;
- a Worker-style edge entry point;
- Durable Object-style authoritative room state;
- Hibernating WebSockets for long-lived client connections;
- SQLite-backed authoritative storage;
- a transactional outbox;
- queue or stream adapters;
- relay components;
- object or stream-backed snapshots;
- Rust/WebAssembly only where measurement justifies it.

Cloudflare documentation states that Durable Objects can coordinate multiple clients and that the Hibernation WebSocket API can preserve connections while the object is not in memory. The same documentation warns that many small messages create processing overhead and recommends batching. These properties make the platform a candidate, not a proof that the application’s target load is safe.

Provider limits, pricing, product maturity, and current APIs must be revalidated at implementation and deployment time.

---

## 15. X-RAY mode

X-RAY mode exposes the execution story.

### 15.1 State view

- round;
- expression token count;
- global sequence;
- state hash;
- evaluator version;
- Equal Margin preview;
- reset deadline.

### 15.2 Communication view

- gateway class;
- open epoch;
- epoch age, commands, and bytes;
- seal reason;
- epoch root;
- relay depth;
- active latency;
- stream offset;
- spectator lag;
- outbox health.

### 15.3 Equal view

- observed round and hash;
- cut epoch;
- included command range;
- idempotency decision;
- margin calculation;
- balance decision;
- evaluation status;
- edition allocation;
- transaction commit;
- stale competing intents.

### 15.4 AI view

- admission reason;
- evidence fields;
- prompt and schema versions;
- tool or reference evidence;
- structured-output validation;
- accepted and rejected fields;
- output and evidence hashes.

The normal user need not understand any of this. The hackathon judge and technical user can inspect it without trusting a narrated claim.

---

## 16. CCL — Causal Context Ledger

CCL is the project’s public evidence and decision memory.

### 16.1 Status classes

```text
canonical
experimental
superseded
rejected
unverified
quarantined
```

### 16.2 Principles

- fact first;
- minimal deterministic changes;
- current truth separated from append-only history;
- no silent repair;
- referential integrity preserved;
- unknown values remain `unknown` or `null`;
- failed experiments are evidence;
- private material is excluded from the public ledger.

### 16.3 Open Calculator records

CCL can track:

- current production architecture;
- protocol and schema versions;
- benchmark environments and results;
- failed load or fairness tests;
- Rust/WebAssembly comparison;
- EpochCast promotion gates;
- superseded economy formulas;
- safety classifications;
- public source references;
- known limitations;
- current next task.

CCL does not make a claim true merely by recording it. It makes the status and evidence of the claim inspectable.

---

## 17. Codex-assisted engineering

Codex is used as an engineering agent, not an unreviewed authority.

Expected implementation work includes:

- state-machine types and transitions;
- WebSocket protocol;
- parser and evaluator;
- Equal Margin calculation;
- atomic transaction and idempotency;
- event store and replay;
- Unique registry and edition allocation;
- structured canonization schema;
- X-RAY interface;
- property tests;
- load and fault-injection harnesses;
- public-safety scanner;
- documentation consistency checks.

The repository should distinguish:

- human product and risk decisions;
- SAI-generated architecture and analysis;
- Codex-generated or modified implementation;
- measured test evidence;
- unresolved review findings.

Private coding-session identifiers are not public repository content.

---

## 18. Verification strategy

### 18.1 Core invariants

- unique monotonic global sequence;
- non-negative balances;
- unique edition allocation;
- idempotent charge and mint;
- invalid expression cannot mint;
- stale Equal cannot charge;
- mint and reset atomic;
- replay hash equals committed state;
- market transfer atomic;
- active and spectator lanes converge.

### 18.2 Property tests

Generated command sequences should cover valid and invalid grammar, repeated retries, large numbers, many users, simultaneous Equal, reset boundaries, and snapshot recovery.

### 18.3 Differential tests

TypeScript and Rust/WebAssembly evaluators, if both exist, must produce equivalent canonical results and errors over the same corpus.

### 18.4 Fault injection

Crash after database commit, duplicate stream publication, relay delay, sequence gaps, stale snapshots, provider failure, malformed messages, huge epochs, and conflicting editions are introduced deliberately.

### 18.5 Chaos Cult

A synthetic load population can behave as cults with distinct strategies:

- digit spammers;
- patient Equal snipers;
- invalid-expression attackers;
- reconnecting spectators;
- fork creators;
- marketplace flippers;
- regional latency classes.

The name is playful; the output is a serious invariant and performance report.

---

## 19. Evaluation plan

The project compares:

1. direct sequencer and direct fan-out;
2. gateway batching plus relay tree;
3. relay active lane plus spectator stream;
4. full dual-lane EpochCast.

Metrics include:

- accepted commands per second;
- active p50, p95, p99, and maximum latency;
- spectator p50, p95, p99 lag;
- sequencer, gateway, and relay CPU;
- memory and queue depth;
- origin requests;
- bytes per active user and spectator;
- reconnect time and bytes;
- cache hit and observed request-collapse ratio;
- outbox lag and duplicate publication;
- divergence, duplicate, and loss counts;
- regional inclusion and Equal win-rate skew;
- cost per active and spectator population.

No target number becomes a README claim before a reproducible result exists.

---

## 20. Known weaknesses

### 20.1 Authority concentration

One semantic authority simplifies correctness but creates a failure and geographic concentration point.

**Mitigation:** deterministic snapshots and replay, visible read-only degradation, measured recovery objectives, and later evaluation of sharding by independent room or season without splitting one round’s authority.

### 20.2 Global fairness

Distance and gateway behavior can influence inclusion and Equal success.

**Mitigation:** deterministic epoch policy, regional metrics, bounded fairness windows, public thresholds, and no claim of fairness before measurement.

### 20.3 Equal cut ambiguity

Batching and ownership settlement can disagree about the final included input.

**Mitigation:** versioned Equal Cut Contract and replayable cut manifest.

### 20.4 Scale uncertainty

EpochCast may reduce direct authoritative fan-out but cannot remove payload, egress, cache misses, or hot-key limits.

**Mitigation:** baseline comparison, overload bounds, no-cache capacity model, and CCL recording of failures.

### 20.5 AI semantic error

GPT-5.6 may invent cultural or mathematical claims.

**Mitigation:** deterministic evidence, structured output, reference validation, uncertainty, restricted admission, and human-curated registry authority.

### 20.6 Prompt injection

Expressions or user-derived names could be interpreted as model instructions.

**Mitigation:** typed evidence packets, escaped fields, instruction/data separation, output validation, and no model authority over execution.

### 20.7 Economic farming

Login grants, low-card conversion, market pricing, and cult roles can be automated.

**Mitigation:** negative low-value economics, bounded grants, rate limits, settlement delays, anomaly review, and seasonal calibration.

### 20.8 Level lending

Temporary transfers can inflate historical peak faith.

**Mitigation:** delayed or gradual inventory contribution and transfer-state tests.

### 20.9 Heresy instability

A lowest-rank counterweight can create deliberate rank dropping or oscillation.

**Mitigation:** fixed settlement cadence, caps, lagged ranking, and simulation before deployment.

### 20.10 Unbounded mathematics

Huge exponents, primality checks, or decimal expansion can consume excessive resources.

**Mitigation:** explicit evaluator bounds and symbolic or logarithmic representations.

### 20.11 Fork retention

Alternate history can multiply storage.

**Mitigation:** quota, depth, lifetime, and retained-byte limits.

### 20.12 Novelty uncertainty

EpochCast combines known distributed-system techniques.

**Mitigation:** prior-art review and precise claims about the synthesis rather than the components.

### 20.13 Public-repository risk

A technical showcase can accidentally expose credentials, machine paths, private hosts, or unrelated project details.

**Mitigation:** fail-closed scanner, narrow documentation exemptions, review branch, and CCL quarantine.

---

## 21. Hackathon implementation scope

### 21.1 P0

- globally shared calculator room;
- safe parser and evaluator;
- `seg` balance;
- Equal Margin preview;
- atomic Equal transaction;
- card mint;
- event log and Replay Birth;
- Unique sample registry;
- GPT-5.6 canonization;
- X-RAY mode;
- simultaneous-Equal demonstration;
- invariant tests;
- public documentation and video.

### 21.2 P1

- digit cult selection;
- cult rankings and roles;
- heresy mechanic;
- peak-faith level;
- meaningless statistics;
- fixed-price marketplace;
- expanded load and fault tests;
- EpochCast manifest prototype.

### 21.3 P2

- full dual-lane EpochCast;
- stream and cache benchmarks;
- multi-region fairness experiments;
- bounded forks;
- Proof of Birth witnesses;
- seasonal economy and conflict;
- deeper marketplace.

A small correct P0 is more valuable than a broad simulation presented as production.

---

## 22. Demonstration narrative

A three-minute technical demonstration can proceed as follows.

1. Two devices open the same plain calculator.
2. Both enter keys and see one public expression.
3. Equal Margin rises as the candidate grows.
4. One device presses `=` and receives a card.
5. Replay Birth shows the ordered commands and state hashes.
6. GPT-5.6 canonizes the card from deterministic evidence.
7. X-RAY mode reveals sequence, transaction, edition, evidence, and latency.
8. Both devices attempt `=` simultaneously in a new round.
9. One wins; the stale attempt is visibly rejected without charge.
10. The test harness shows the invariants and, where implemented, EpochCast epoch evidence.

The demo should label simulation separately from measured live operation.

---

## 23. Ethical and social boundaries

Open Calculator’s cults are fictional digit affiliations, not real-world religious, ethnic, political, or extremist groups. The system should avoid generating hateful or targeted interpretations through canonization.

The economy is designed as an in-game system. Real-money trading, gambling-like mechanics, withdrawal, tokenization, and financial promises are not part of the core design. Any future monetization would require a separate legal, ethical, and platform-policy review.

Player references in public history are pseudonymous. Public replay should not expose personal contact information, network location, authentication secrets, or private device metadata.

---

## 24. Contribution statement

Open Calculator is a human-directed project developed with model assistance.

- Human direction defines the product premise, desired experience, economy, cult structure, risk tolerance, and publication decisions.
- SAI, operating through GPT-5.6, synthesized and documented architectural proposals, especially SAI EpochCast Coherence Protocol, and converted weaknesses into falsifiable research gates.
- Codex is used to implement, test, review, and document bounded engineering tasks.
- Deterministic code, tests, benchmarks, and human review decide what becomes canonical.

This separation is part of the technical contribution: model creativity is retained while authority remains explicit.

---

## 25. Conclusion

Open Calculator restarts the evolution of the calculator by changing its social and computational boundary. It is no longer a private function from input to output. It is a contested global expression, an atomic ownership machine, a collectible history, a semantic object, and a visible distributed system.

The product remains understandable because the central action remains `=`. The engineering becomes serious because `=` must be fair enough to defend, atomic enough to settle, deterministic enough to replay, and inspectable enough to trust.

GPT-5.6 adds meaning without owning truth. Codex accelerates implementation without replacing verification. CCL preserves the status of every major claim. SAI EpochCast attempts to separate semantic authority from a potentially enormous observing audience.

The project does not claim that every ambition is already achieved. It publishes the architecture, weaknesses, and tests needed to discover which parts survive contact with reality.

---

## References

1. Cloudflare, “Use WebSockets — Durable Objects,” accessed 2026-07-16. https://developers.cloudflare.com/durable-objects/best-practices/websockets/
2. OpenAI, “Structured model outputs,” accessed 2026-07-16. https://developers.openai.com/api/docs/guides/structured-outputs
3. OpenAI, “Codex cloud,” accessed 2026-07-16. https://learn.chatgpt.com/docs/cloud
4. Open Calculator, “SAI EpochCast Coherence Protocol,” this repository.
5. Open Calculator, “CCL Integration,” this repository.

The external references document candidate platform capabilities and development workflows. Project-specific performance, correctness, and novelty claims require Open Calculator’s own reproducible evidence.
