# Open Calculator

> **One calculator. One authoritative expression. Everyone can touch it. Only one player can own the result.**

Open Calculator is a globally shared calculator, a number-collecting game, and a distributed-systems research instrument presented through the smallest interface possible: a calculator.

Every accepted keypress changes the same public expression. Any player may spend the in-game unit **seg** to press `=`. The winning `=` atomically evaluates the expression, charges the player, mints the result as a persistent number card, and starts the next round. Waiting may produce a more valuable number, but another player may claim it first.

The project asks a deliberately strange engineering question:

> What happens when a calculator is rebuilt as a real-time authoritative state machine with contested input, atomic ownership, replayable history, machine-generated cultural interpretation, and spectator-scale communication?

## The major research contribution: SAI EpochCast

The repository gives first-class space to **SAI EpochCast Coherence Protocol**, an experimental communication architecture created during the GPT-5.6-assisted design of Open Calculator.

**EpochCast separates authority from audience.** Active participants send inputs through an authoritative WebSocket path. High-volume spectators and historical readers consume committed epochs through a stream-oriented read path. The authority processes ordered commitments rather than performing one independent fan-out operation per observer.

Its central design sentence is:

> **The authority processes commitments, not audiences.**

EpochCast combines:

- active-only micro-epochs, provisionally targeted around 40 ms;
- deterministic ordering inside each sealed epoch;
- Merkle-root commitment to ordered input manifests;
- incremental transition capsules instead of full-state rebroadcasts;
- a strong, explicitly cut transaction path for `=`;
- spectator coherence through an append-only public stream;
- offset recovery, replay, and forkable calculation history;
- dual-lane state-hash handoff so active and spectator views can be checked against the same authority.

EpochCast is **not presented as peer-reviewed, production-proven, or universally novel**. It is published as an ambitious, falsifiable protocol hypothesis with explicit failure modes and benchmark gates.

Read the standalone specification:

- [SAI EpochCast Coherence Protocol](docs/research/sai-epochcast-coherence-protocol.md)

## Core game loop

1. Players connect to the same calculator round.
2. Accepted digits and operators immediately extend the shared expression.
3. The prospective result and **Equal Margin** may rise as the expression grows.
4. A player spends `seg` to press `=`.
5. Exactly one valid, current `=` transaction wins.
6. The result becomes a number card, the winner becomes its minter, and the expression resets.
7. Stale competing `=` requests are rejected without charge.

This creates a public timing game: claim a modest result safely, or wait for a rare pattern while risking the entire opportunity.

## Number cards

A minted card can preserve:

- evaluated result;
- originating formula;
- round and global sequence;
- minter;
- Equal Margin paid;
- contributors;
- deterministic mathematical features;
- rarity and score evidence;
- catalog and issuance data for Unique cards;
- cult-related features;
- state and event commitments;
- GPT-generated canonization with provenance.

The working rarity ladder is:

`Dust → Common → Rare → Epic → Legendary → Mythic → Unique`

**Unique does not mean one-of-one.** A Unique number belongs to a curated registry and may be issued repeatedly. Each copy carries a catalog identifier and an edition number. Edition numbers can themselves become strategically or culturally meaningful.

Low-value Dust and Common cards are not intended for open-market trading. They can be sold to the system or **Segmentized** into `seg`, making indiscriminate `=` spam economically lossy. Rare and higher cards are candidates for a fixed-price marketplace in the initial implementation.

## seg and Equal Margin

`seg` is the game unit, named after seven-segment displays. Equal Margin is the cost of claiming the current result.

The fee should rise with deterministic measures such as magnitude, digit count, expression risk, and expected rarity. Extremely large results must become correspondingly expensive rather than allowing unbounded cheap minting.

Seven-segment material values provide an additional design surface:

| Digit | Lit segments |
|---:|---:|
| 0 | 6 |
| 1 | 2 |
| 2 | 5 |
| 3 | 5 |
| 4 | 4 |
| 5 | 5 |
| 6 | 6 |
| 7 | 3 |
| 8 | 7 |
| 9 | 6 |

This deliberately separates symbolic value from material cost. For example, `1` can be sacred while remaining cheap to display, whereas `8` is materially dense.

## Cults, levels, and intentionally meaningless statistics

Each player may align with one digit from `0` through `9`, preferably locked for a season. Cards contribute cult points through deterministic evidence such as digit occurrence, formula history, issuance number, and stable card features.

Cult position changes social roles:

- the top three cults become dominant powers competing for the Cult Lord position;
- middle-ranked cults act as Farmers with stronger low-card conversion economics;
- the lowest cult becomes the Inquisitor, and its digit becomes the current heresy digit;
- dominant cards containing the heresy digit can receive a score penalty, allowing the weakest cult to poison the strongest.

Player level is based on historical peak inventory faith rather than current inventory, so legitimate selling does not erase progression. The provisional cumulative threshold is:

```text
requiredFaith(level) = 100 × (level^2.4 − 1)
```

This curve is only a calibration seed. It must be fitted after real card-score distributions exist.

Level-ups grant points in statistics such as `ATK`, `DEF`, `VIT`, `AGI`, `LUK`, `INT`, `FAI`, and `HER`. These statistics intentionally do not provide conventional combat power. Their arrangement, repetition, and alignment with cult digits can carry social or cult meaning. The layer is mechanically unnecessary by design and therefore exposes how players create value from patterns alone.

## Authoritative state and atomic ownership

The production baseline is an event-sourced authoritative state machine. A deployment may use Cloudflare Durable Objects and Hibernating WebSockets, but provider-specific choices remain replaceable behind interfaces.

Each accepted event records enough evidence to reproduce the transition:

```text
sequence
round
actor reference
command
before-state hash
after-state hash
idempotency key
commit timestamp
```

The `=` path is a single atomic transaction:

```text
validate round and version
validate idempotency key
calculate Equal Margin
verify sufficient seg
safely evaluate the expression
derive deterministic card features
allocate registry edition when applicable
debit seg
mint card
append event and outbox record
reset round
commit
```

No JavaScript `eval` is allowed. Expressions are parsed into a constrained abstract syntax tree and evaluated with explicit limits on depth, node count, exponentiation, execution time, and numeric representation.

## GPT-5.6 Meaning Protocol

GPT-5.6 is used as a **Number Canonization and Meaning Protocol**, not as financial or game-state authority.

Deterministic code remains authoritative for:

- balances and fees;
- expression evaluation;
- rarity mathematics;
- registry membership and edition allocation;
- ownership;
- marketplace settlement;
- event ordering and hashes.

The model receives validated evidence and returns schema-constrained proposals such as:

- display name;
- short description;
- semantic tags;
- mathematical and cultural interpretations;
- cult readings;
- evidence references;
- uncertainty fields.

A deterministic admission controller validates the proposal before canonization. Prompt, evidence, schema version, output, and model metadata are hashed for replay and audit. Common low-value cards should normally bypass model calls; deeper canonization is reserved for strong candidates.

## X-RAY mode

The normal interface should remain almost absurdly simple. **X-RAY mode** exposes the machinery underneath:

- current round and sequence;
- state hash;
- active connections;
- epoch and batch boundaries;
- input and commit latency;
- Equal transaction stage;
- idempotency decision;
- edition allocation;
- replay result;
- GPT evidence, tool calls, schema validation, and canonization status.

This makes the hackathon demonstration inspectable rather than merely theatrical.

## CCL: Causal Context Ledger

Open Calculator uses **CCL v1 — Causal Context Ledger** as a public research and implementation evidence layer.

CCL separates:

- current canonical truth;
- append-only history;
- experimental hypotheses;
- superseded decisions;
- rejected approaches;
- unverified claims;
- quarantined material.

The ledger follows a fact-first rule: unknown values remain `unknown` or `null`; they are not silently invented. Updates should be minimal, deterministic, referentially intact, and reviewable.

Read [CCL integration](docs/ccl/ccl-integration.md).

## Verification priorities

The project treats the following as non-negotiable invariants:

- global sequence numbers are unique and monotonic;
- balances never become negative;
- one registry edition is never allocated twice;
- one idempotency key cannot charge or mint twice;
- invalid expressions cannot mint cards;
- stale `=` attempts are not charged;
- mint and reset are atomic;
- replayed history reaches the committed state hash;
- active and spectator lanes converge on the same committed state.

The evaluation plan includes property tests, simultaneous-`=` races, reconnect tests, sequencer restart, outbox recovery, malformed inputs, oversized epochs, fork abuse, and regional fairness measurement.

## Repository map

```text
docs/
├── paper/open-calculator-paper.md
├── research/sai-epochcast-coherence-protocol.md
├── research/open-problems.md
├── evaluation/benchmark-plan.md
├── architecture/atomic-equal.md
├── ccl/ccl-integration.md
├── safety/publication-policy.md
├── DECISIONS.md
└── SOURCE_MAP.md

ccl/
├── state.json
├── history/
├── compact/
├── quarantine/
└── schema/

scripts/public-safety.mjs
tests/public-safety.test.mjs
```

## Status vocabulary

Every substantial claim should carry one of these meanings:

- **canonical** — accepted current design or verified implementation truth;
- **experimental** — testable candidate not yet promoted;
- **superseded** — previously considered but replaced;
- **rejected** — deliberately not pursued, with reason;
- **unverified** — plausible but lacking sufficient evidence;
- **quarantined** — withheld from normal publication or decision flow.

## Hackathon scope

### P0

Real-time shared calculator, atomic `=` and `seg`, safe evaluator, card minting, event replay, GPT canonization, X-RAY mode, concurrency demonstration, tests, documentation, and demo video.

### P1

Cults, role transitions, Unique registry, levels, meaningless statistics, load testing, and expanded evidence views.

### P2

Deeper marketplace mechanics, seasonal conflict, advanced balancing, production-scale EpochCast experiments, and forkable public history.

## Truthfulness boundary

Open Calculator is a real project design, but several components in this repository begin as research specifications. Target throughput, global scale, cost savings, CDN request collapse, fairness, and claims of protocol novelty are not facts until measured. The documentation distinguishes demonstrated behavior from targets and hypotheses.

## Primary documents

- [Full Open Calculator paper](docs/paper/open-calculator-paper.md)
- [SAI EpochCast Coherence Protocol](docs/research/sai-epochcast-coherence-protocol.md)
- [Open problems](docs/research/open-problems.md)
- [Benchmark plan](docs/evaluation/benchmark-plan.md)
- [Atomic Equal contract](docs/architecture/atomic-equal.md)
- [CCL integration](docs/ccl/ccl-integration.md)
- [Publication safety policy](docs/safety/publication-policy.md)

## Public-safety boundary

This repository may publicly name Open Calculator, SAI, EpochCast, CCL, GPT-5.6, Codex, OpenAI, Cloudflare, Rust, WebAssembly, and cited public technologies. It must not publish credentials, private keys, personal contact details, private hosts, non-documentation network addresses, local machine paths, session identifiers, private infrastructure topology, or unrelated private project names.

The scanner is fail-closed: an unreadable tracked text file is a publication failure rather than an implicit pass.

## License and research use

Licensing is intentionally left for an explicit project decision before a release claim is made. Until a license file is added, normal copyright rules apply.
