# SAI EpochCast Coherence Protocol

## Commitment-Oriented Communication for a Spectator-Heavy Global State Machine

**Status:** experimental protocol specification  
**Project:** Open Calculator  
**Provenance:** synthesized by SAI, a GPT-5.6 design agent, under human project direction  
**Publication posture:** ambitious, falsifiable, not yet peer-reviewed or production-proven

---

## Abstract

SAI EpochCast is an experimental application-level communication architecture for systems with a small authoritative write surface, a large observing audience, and a need for deterministic, replayable state.

Its motivating workload is Open Calculator: one globally shared expression receives concurrent keypresses, one authoritative order determines the visible formula, and a winning `=` atomically creates ownership of the result. A conventional real-time design can make the authority responsible not only for deciding state but also for distributing every transition independently to every connected observer. As the audience grows, the read audience can dominate the cost and operational shape of the authoritative system.

EpochCast separates these concerns. Active participants use a low-latency WebSocket lane. Gateways fold accepted commands into short, explicitly sealed epochs. A sequencer commits deterministic manifests and state transitions. Relays distribute low-latency deltas to active clients. An append-only stream carries committed epochs, snapshots, and history to spectators and reconnecting readers through offset-based consumption and cache-friendly delivery.

The architecture is summarized by one sentence:

> **The authority processes commitments, not audiences.**

EpochCast does not claim to eliminate bandwidth, create physical simultaneity, or make the number of observers irrelevant. It attempts to make authoritative work scale primarily with accepted commitments and bounded distribution topology rather than with a direct per-observer loop at the sequencer.

---

## 1. Why EpochCast exists

Open Calculator appears to be a trivial application, but its semantics create a concentrated distributed-systems problem:

- there is one public expression;
- inputs can arrive from many regions;
- accepted order changes the meaning of the expression;
- the `=` operation creates economic ownership;
- stale `=` requests must not be charged;
- observers expect a coherent public history;
- replay must reproduce the committed state;
- the interface should remain live even when most connected users are only watching.

A direct design has an authoritative room receive each input, update state, and broadcast each change to every connection. This can be appropriate at modest scale. The problem appears when the authority performs three different jobs at once:

1. deciding the order of accepted commands;
2. committing state and ownership;
3. individually serving a very large audience.

EpochCast preserves a single authority for semantic correctness while moving audience delivery into a distinct coherence system.

---

## 2. Design goals

EpochCast is designed around the following goals.

### 2.1 One semantic authority

There must be one canonical order for each round. Edge nodes may collect, validate, compress, and relay commands, but they may not independently create authoritative ownership.

### 2.2 Low-latency active interaction

A player pressing a key should see provisional or committed feedback quickly enough that the calculator feels alive. Micro-epochs must be short and active-only: no timer should run merely because a room exists.

### 2.3 Spectator-heavy scalability

The authoritative sequencer should not maintain a direct send loop over an unbounded spectator population. Spectators should consume committed history from a stream-oriented lane that can use shared cursors, chunking, intermediary caching, and replay.

### 2.4 Deterministic replay

An epoch must contain or reference enough information to reproduce ordering, evaluation, and the resulting state hash.

### 2.5 Strong ownership boundary

The `=` operation must define an explicit cut: which prior commands are included in the claimed expression, which later commands belong to the next round, and why exactly one claimant won.

### 2.6 Inspectability

Each layer should expose evidence in X-RAY mode: epoch identifiers, manifests, roots, offsets, transition hashes, queue lag, recovery state, and Equal cut decisions.

### 2.7 Replaceable infrastructure

Cloud services may implement the first version, but the protocol model should not depend on one vendor name for its correctness.

---

## 3. Non-goals

EpochCast does not promise:

- zero latency;
- zero bandwidth;
- a physically absolute order for events that are concurrent in the real world;
- linear scaling without limits;
- automatic global fairness;
- correctness merely because a Merkle root exists;
- immunity from sequencer failure;
- free historical retention;
- guaranteed request collapse by a CDN;
- universal novelty relative to all prior systems.

These are research and engineering boundaries, not marketing caveats.

---

## 4. Core concepts

### 4.1 Command

A command is a validated request to affect the shared state.

```text
Command {
  command_id
  actor_ref
  gateway_id
  gateway_local_sequence
  observed_round
  observed_state_hash
  operation
  idempotency_key
  received_at_monotonic
}
```

The public event record should avoid unnecessary personal information. `actor_ref` is a stable pseudonymous game reference, not an email address or private identity.

### 4.2 Micro-epoch

A micro-epoch is a short, bounded collection window opened only while commands are arriving. The initial design target is approximately 40 ms, but this number is experimental rather than canonical.

An epoch may seal because of:

- elapsed active window;
- maximum command count;
- maximum encoded bytes;
- an Equal cut request;
- backpressure policy;
- administrative drain or shutdown.

### 4.3 Ordered manifest

A sealed epoch is represented as an ordered manifest.

```text
EpochManifest {
  protocol_version
  room_id
  round_id
  epoch_id
  previous_epoch_root
  seal_reason
  ordering_rule_version
  ordered_commands[]
  command_count
  encoded_bytes
  gateway_receipts[]
}
```

### 4.4 Epoch root

The manifest is committed by a cryptographic root.

```text
epoch_root = MerkleRoot(canonicalEncode(ordered_commands))
```

The root demonstrates that a later manifest matches the committed ordered command set. It does not prove that the commands were fair, valid, or correctly executed. Those require independent checks.

### 4.5 Transition capsule

A transition capsule is the minimal committed output needed for clients to advance or verify state.

```text
TransitionCapsule {
  protocol_version
  room_id
  round_before
  round_after
  epoch_id
  epoch_root
  previous_state_hash
  next_state_hash
  accepted_command_ids[]
  rejected_command_summaries[]
  expression_delta
  ownership_delta?
  balance_delta_commitment?
  stream_offset
  sequencer_signature_or_service_attestation?
}
```

A capsule should avoid broadcasting a full state snapshot for every small change. Full or compact snapshots are periodic recovery objects.

### 4.6 Strong Path

Normal keypresses may be folded into micro-epochs. `=` enters a Strong Path because it can debit currency, mint ownership, allocate an edition, and reset the round.

The Strong Path seals the relevant epoch boundary, verifies the claimant against the current round, and performs one atomic transaction.

### 4.7 Spectator coherence

Spectator coherence means that observers may receive committed state later than active clients, but every valid observer can identify the same ordered history and converge on the same committed state hash.

It is not frame-perfect simultaneity. It is verifiable convergence.

---

## 5. Two-lane architecture

```text
ACTIVE WRITE / LOW-LATENCY READ LANE

Client
  → Regional Gateway
  → Epoch Fold and Validation
  → Global Sequencer
  → Active Relay Tree
  → Active Clients

PUBLIC SPECTATOR / HISTORY LANE

Global Sequencer
  → Transactional Outbox
  → Append-Only Durable Stream
  → Chunk and Cache Layer
  → SSE, long-poll, or stream readers
  → Spectators, replay tools, and reconnecting clients
```

### 5.1 Active lane

The active lane is intended for users whose commands can affect the round and for nearby low-latency confirmation.

A candidate deployment uses WebSockets between clients, gateways, relays, and the authoritative state component. A platform with hibernating WebSockets can reduce idle compute duration while preserving connections, but active timers and outbound connections may prevent hibernation. Therefore the protocol requires active-only timers and explicit cost measurement rather than assuming hibernation will solve all connection cost.

### 5.2 Spectator lane

The spectator lane publishes committed epochs and snapshots to an append-only stream. Consumers read from a cursor or offset. Shared chunks can be distributed through cacheable HTTP mechanisms where semantics and infrastructure permit.

A spectator may be seconds behind under pressure without affecting authority. The interface must disclose lag rather than presenting delayed state as instantaneous truth.

### 5.3 Lane handoff

A client may move between spectator and active modes.

A handoff object includes:

```text
LaneHandoff {
  round_id
  last_epoch_id
  last_stream_offset
  state_hash
  snapshot_ref?
  issued_at
}
```

The receiving lane verifies the state hash or requests a newer snapshot before allowing state-affecting commands.

---

## 6. Epoch-Coherent Zero-ish Mode

“Zero-ish” does not mean zero cost or zero messages. It describes a target in which the marginal authoritative coordination work for a large spectator audience approaches a bounded commitment operation rather than a direct action for every observer.

The sequence is:

1. gateways receive validated commands;
2. commands are collected into active micro-epochs;
3. each gateway produces a canonical local bundle;
4. the sequencer deterministically orders bundles and commands;
5. one manifest and root represent the epoch;
6. the state machine executes the ordered manifest;
7. one transition capsule is committed;
8. active relays distribute the capsule;
9. the outbox publishes the capsule and manifest reference to the spectator stream;
10. spectators consume by offset and converge on the committed hash.

The intended optimization is not “one packet for the whole world.” The optimization is that authority commits an epoch once, while distribution infrastructure handles many readers.

---

## 7. Deterministic epoch ordering

### 7.1 The impossibility boundary

Events arriving from different regions do not possess a single observable physical order that all parties can know without coordination. EpochCast therefore defines a protocol order, not a metaphysical order.

### 7.2 Candidate order key

A candidate deterministic key is:

```text
orderKey(command) = H(
  previous_epoch_root ||
  round_id ||
  gateway_id ||
  gateway_local_sequence ||
  command_id
)
```

Commands are sorted lexicographically by the derived key after validating local sequence continuity. This prevents the sequencer from silently choosing an arbitrary order after seeing command contents, but it does not by itself prevent gateways from manipulating admission or timestamps.

### 7.3 Alternative ordering modes

The benchmark should compare:

- sequencer receipt order;
- gateway receipt buckets plus deterministic tie-break;
- previous-root-derived shuffle;
- commit-reveal admission for high-value rounds;
- regional quota interleaving;
- hybrid fairness windows.

No ordering rule should be called fair until regional win-rate and latency distributions are measured under adversarial load.

### 7.4 Manifest evidence

For every epoch, the public evidence should include:

- ordering-rule version;
- gateway bundle roots;
- local sequence ranges;
- final ordered command identifiers;
- rejected gaps or duplicates;
- previous epoch root;
- final epoch root.

---

## 8. The Equal Cut Contract

The hardest semantic boundary is `=`.

Suppose a digit command and an Equal command are in flight from different regions. The system must answer:

- does the digit belong to the claimed formula;
- does it belong to the next round;
- was the claimant charged;
- why did a competing claimant lose;
- can the result be replayed exactly?

### 8.1 Cut request

An Equal request carries:

```text
EqualIntent {
  command_id
  actor_ref
  observed_round
  observed_state_hash
  maximum_margin?
  idempotency_key
  gateway_epoch_hint
}
```

### 8.2 Candidate cut semantics

1. The gateway receiving Equal immediately seals its current local epoch.
2. It marks the Equal intent as requiring a global cut.
3. The sequencer establishes a `cut_epoch_id` and closes admission for the claimed round according to the versioned cut policy.
4. All bundles admitted before the cut are finalized.
5. The deterministic order is computed.
6. Equal intents are evaluated in that order against the evolving state.
7. The first valid intent with sufficient balance and matching round can commit.
8. The winning transaction evaluates, debits, mints, appends, and resets atomically.
9. Later Equal intents observing the old round become stale and are rejected without charge.
10. Commands excluded by the cut are explicitly assigned to the next round or rejected according to command semantics.

### 8.3 Cut manifest

```text
EqualCutManifest {
  round_id
  cut_epoch_id
  included_epoch_ids[]
  included_command_range
  excluded_command_ids[]
  winning_equal_command_id?
  stale_equal_command_ids[]
  pre_transaction_state_hash
  post_transaction_state_hash
  next_round_id
}
```

### 8.4 Required invariant

Given the same committed manifests, cut policy version, and pre-state, an independent witness must derive the same winner, charge, card, edition, reset, and post-state hash.

---

## 9. Gateway behavior

A gateway is not a semantic authority. It performs bounded work:

- authenticates or assigns a pseudonymous actor reference;
- checks protocol version and message size;
- performs syntax-level command validation;
- applies local rate and abuse limits;
- assigns a gateway-local sequence;
- deduplicates idempotency keys within a bounded window;
- collects commands into a micro-epoch;
- seals on time, count, bytes, Equal, drain, or pressure;
- forwards a canonical bundle to the sequencer;
- retains short-lived receipts for audit and retransmission.

### 9.1 Bounded epoch rules

Every implementation must define:

```text
max_epoch_duration
max_commands_per_epoch
max_encoded_bytes_per_epoch
max_actor_commands_per_epoch
max_pending_epochs
max_retransmissions
```

Without these bounds, microbatching can convert traffic spikes into unbounded memory growth.

### 9.2 Backpressure

When limits are reached, gateways must choose an explicit behavior:

- seal early;
- reject low-priority commands;
- shed spectators from the active lane;
- downgrade clients to the spectator lane;
- apply actor-specific cooldown;
- reject new connections;
- enter degraded read-only mode.

Silent queue growth is prohibited.

---

## 10. Sequencer behavior

The sequencer owns canonical state transitions.

For each epoch it:

1. validates bundle continuity and protocol versions;
2. rejects duplicate commands and invalid local ranges;
3. deterministically orders accepted commands;
4. executes the state machine;
5. handles the Equal Strong Path when present;
6. commits state, event records, and transactional outbox entries;
7. emits a transition capsule;
8. advances the canonical epoch and state hashes.

### 10.1 Commitment-oriented work

The sequencer receives bundles and emits commitments. It does not need to know every spectator connection. Its output cardinality is related to accepted epochs and relay topology, not directly to the number of public readers.

### 10.2 Recovery

The sequencer must persist enough state for deterministic recovery:

- current round;
- current expression representation;
- balances or settlement references;
- card and edition counters;
- last committed global sequence;
- last epoch root;
- current state hash;
- pending and delivered outbox records;
- recent idempotency records;
- snapshot version.

On restart, it restores the last committed state, reconciles the outbox, and refuses new writes until invariants pass.

---

## 11. Relay topology

Active relays reduce direct fan-out from the sequencer.

A static or slowly changing relay tree is preferable to dynamic topology changes on every connection. Each relay receives one capsule and forwards it to a bounded set of downstream relays or active clients.

Relay evidence includes:

- upstream capsule hash;
- relay receipt time;
- downstream send count;
- queue depth;
- dropped or slow connections;
- last acknowledged epoch per connection class.

Relays never alter authoritative content. A client rejects a capsule whose epoch root or state transition chain is invalid.

---

## 12. Append-only spectator stream

The public stream contains committed facts, not provisional input.

A stream record may contain:

```text
StreamRecord {
  offset
  room_id
  round_id
  epoch_id
  epoch_root
  previous_state_hash
  next_state_hash
  transition_capsule
  manifest_ref
  snapshot_ref?
  committed_at
}
```

### 12.1 Offset recovery

A reconnecting reader sends its last trusted offset and state hash. The service returns:

- the next contiguous records;
- a compact delta range;
- or a snapshot plus a later offset when the gap exceeds retention or efficiency thresholds.

### 12.2 Chunking

Records may be packed into immutable chunks aligned to stable offset ranges. A chunk name should be content-addressed or versioned so intermediaries do not serve mutable content under a stable key.

### 12.3 Cache limits

Intermediary request collapse and cache hit ratio are platform behaviors to measure, not protocol guarantees. The benchmark must report observed collapse rather than assuming it.

### 12.4 Stream dependency risk

A provider-specific durable stream product may be used only behind an adapter. The project must retain a fallback based on a database outbox plus an independently operated append service or queue-to-object pipeline.

---

## 13. Transactional outbox

Authority and stream publication are not automatically atomic when they use different systems.

The canonical transaction writes:

- new state;
- event records;
- ownership changes;
- edition allocation;
- an outbox record containing the intended stream publication.

A publisher later sends undelivered outbox records to the stream. Delivery is at least once; stream records and consumers deduplicate by stable record identifier.

### 13.1 Failure cases

The recovery design must handle:

- state committed, process crashes before publish;
- publish succeeds, acknowledgment is lost;
- duplicate publish after retry;
- stream temporarily unavailable;
- publisher lease split;
- out-of-order worker retries;
- snapshot created before all prior outbox records are visible.

### 13.2 Fencing

A publisher lease or monotonically increasing producer generation prevents an old publisher from continuing after a replacement takes over.

### 13.3 Reconciliation

A periodic witness compares:

- committed outbox range;
- published stream range;
- stream record identifiers;
- epoch and state hash continuity.

Missing records are republished; conflicting content is quarantined rather than silently repaired.

---

## 14. Forkable calculation history

An append-only calculation stream enables alternate timelines.

A fork references:

```text
Fork {
  parent_room_id
  parent_stream_offset
  parent_state_hash
  fork_id
  fork_policy_version
  creator_ref
  created_at
  retention_class
}
```

A fork can support:

- replaying the birth of a card;
- testing an alternative command order;
- comparing TypeScript and Rust/WebAssembly evaluators;
- reproducing a bug;
- evaluating a new Equal Margin rule;
- creating a private or temporary alternate calculator timeline.

Forks do not alter the canonical history. They must be quota-limited by count, depth, retained bytes, and lifetime.

---

## 15. Optional asynchronous Proof of Birth

A card may receive a Proof of Birth bundle after the authoritative mint transaction.

```text
ProofOfBirth {
  card_id
  round_id
  equal_cut_manifest_hash
  included_epoch_roots[]
  expression
  evaluator_version
  deterministic_feature_hash
  ownership_event_id
  resulting_state_hash
  replay_witness_results[]
}
```

Proof generation is asynchronous so the winning Equal transaction does not wait for expensive packaging or independent witnesses. The card exists after the atomic mint; proof status is visible as pending, verified, failed, or quarantined.

A Merkle root alone is insufficient. At least one independent replay witness should execute the ordered manifest and confirm the resulting state hash.

---

## 16. Rust and WebAssembly evaluation

EpochCast does not require Rust, but a deterministic evaluator may benefit from a Rust/WebAssembly implementation.

Three candidates should be compared:

- **A:** TypeScript full expression evaluator;
- **B:** Rust/WebAssembly full expression evaluator;
- **C:** Rust/WebAssembly incremental transition-table evaluator.

Promotion requires:

- output equivalence over the canonical corpus;
- deterministic serialization equivalence;
- meaningful p99 or CPU improvement;
- acceptable cold-start cost;
- bounded memory growth;
- acceptable binary size;
- no unsafe numeric divergence;
- implementation complexity justified by measured benefit.

A Rust label is not evidence of speed. Only benchmark results can promote a candidate.

---

## 17. Security model

### 17.1 Threats

- command flooding;
- connection exhaustion;
- malicious gateway admission;
- duplicate or forged bundles;
- replayed idempotency keys;
- stale Equal attempts;
- edition collisions;
- negative-balance races;
- malformed or explosive expressions;
- oversized epoch payloads;
- relay corruption;
- stream truncation or reordering;
- fork-storage abuse;
- witness collusion;
- canonization prompt injection through expression-derived text;
- publication of private data in diagnostics.

### 17.2 Defenses

- bounded messages and epochs;
- syntax validation before authority;
- actor and connection rate limits;
- monotonic gateway-local sequences;
- content commitments;
- canonical serialization;
- transactional state transitions;
- idempotency tables;
- stale-round no-charge rule;
- outbox deduplication;
- state-hash chain validation;
- snapshot signatures or service attestations where appropriate;
- replay witnesses;
- public-safety filtering of logs and documents;
- no raw credentials, private network topology, or personal contact information in public evidence.

---

## 18. Fairness model

EpochCast can define deterministic order, but deterministic does not automatically mean fair.

The evaluation must measure:

- command inclusion rate by region;
- median and tail time from client send to epoch admission;
- Equal win rate after controlling for send time;
- gateway-specific rejection and shedding rate;
- effect of clock skew;
- effect of malicious burst timing;
- advantage created by proximity to the sequencer;
- advantage created by knowing the ordering rule.

Potential mitigations include:

- short fairness windows;
- per-region bundle quotas;
- previous-root-derived tie-breaks;
- blinded command commitments for high-value rounds;
- maximum commands per actor per epoch;
- delayed reveal of ordering salt;
- public fairness reports.

Each mitigation trades latency, complexity, manipulability, and user comprehension. The simplest rule that meets a published fairness threshold should win.

---

## 19. Coherence invariants

The following properties define protocol success.

### Ordering

- every committed command has one global position;
- no command identifier is committed twice;
- every epoch links to the previous epoch root;
- every gateway-local range is either contiguous or explicitly records gaps.

### State

- executing committed manifests from a trusted snapshot yields the committed next-state hash;
- a transition capsule cannot skip a state hash without an explicit snapshot handoff;
- active and spectator lanes converge on the same committed state.

### Equal

- at most one winning Equal transaction exists per round;
- stale Equal attempts do not debit balance;
- a successful debit, mint, edition allocation, event append, outbox write, and reset are atomic;
- the Equal cut manifest uniquely identifies included and excluded commands.

### Stream

- stream offsets are monotonic within a stream;
- duplicate records are content-identical and deduplicable;
- missing ranges are detectable;
- snapshot recovery identifies the exact state hash and subsequent offset.

### Safety

- no secret material is required in public protocol evidence;
- public diagnostics use pseudonymous references;
- read or parse failures do not silently pass validation.

---

## 20. X-RAY representation

EpochCast should be visible during the demo.

A compact X-RAY panel can show:

```text
ROUND              1842
STATE HASH         6f…91
ACTIVE CLIENTS     47
SPECTATORS         3,812
GATEWAY            region-class-b
OPEN EPOCH         90114
EPOCH AGE          23 ms
COMMANDS / BYTES   18 / 412
SEAL REASON        equal-cut
EPOCH ROOT         a2…0c
SEQUENCER COMMIT   41 ms
ACTIVE P95         88 ms
STREAM OFFSET      742190
SPECTATOR LAG      310 ms
OUTBOX              healthy
REPLAY WITNESS     verified
```

Values shown in a real demo must be measured. Mock values must be visibly labeled as simulation.

---

## 21. Benchmark matrix

EpochCast must be compared against simpler baselines.

### Baseline A: direct authority and direct fan-out

Each command reaches the sequencer, is applied, and is sent directly to every connected client.

### Baseline B: gateway batching and relay tree

Gateways batch commands; the sequencer commits; relays handle active fan-out. There is no separate spectator stream.

### Experiment C: stream spectator lane

Active state uses Baseline B. Spectators read committed events from a durable append-only stream.

### Experiment D: full dual-lane EpochCast

Micro-epochs, deterministic manifests, Merkle roots, transition capsules, active relay tree, transactional outbox, spectator stream, offset recovery, and Equal Strong Path are all enabled.

### Required measurements

- accepted commands per second;
- sequencer CPU time per command and per epoch;
- gateway CPU and memory;
- relay CPU and send queue depth;
- origin requests;
- active bytes per user;
- spectator bytes per user;
- total egress;
- p50, p95, p99, and maximum active commit latency;
- p50, p95, p99 spectator lag;
- reconnect recovery time and bytes;
- outbox delay and duplicate publish rate;
- snapshot creation and restore time;
- cache hit and observed request-collapse ratio;
- regional inclusion and Equal win-rate skew;
- state divergence, duplicate, and lost-event counts;
- cost per 1,000 active users;
- cost per 10,000 spectators.

---

## 22. Fault-injection program

The following events should be introduced deliberately:

- gateway process terminates with an open epoch;
- duplicate gateway bundle arrives;
- gateway-local sequence gap appears;
- sequencer restarts between state commit and outbox publication;
- publisher acknowledgment is lost after successful stream append;
- relay delays one epoch and receives a later one;
- spectator requests an expired offset;
- snapshot and delta disagree;
- two Equal intents arrive from different gateways;
- actor repeats an idempotency key;
- a command exceeds byte limits;
- a single epoch exceeds count limits;
- stream becomes unavailable;
- old publisher continues after lease replacement;
- evaluator implementations disagree;
- fork quota is exhausted;
- a diagnostic field contains content resembling a credential.

Success means the system fails explicitly, preserves committed truth, and either recovers deterministically or enters a visible quarantined/read-only state.

---

## 23. Weaknesses and open research questions

### 23.1 No physical absolute order

Epochs create protocol order. They cannot discover a universal real-world order among geographically concurrent inputs.

**Research gate:** publish regional fairness results and demonstrate deterministic reproduction across independent implementations.

### 23.2 Equal boundary complexity

The interaction between a short batching window and a value-creating cut is subtle.

**Research gate:** every simultaneous-Equal and adjacent-input test must produce one replayable cut manifest and no stale charge.

### 23.3 Payload growth

Forty milliseconds limits time, not bytes. A burst can still be large.

**Research gate:** enforce count and byte ceilings; prove bounded memory under overload.

### 23.4 CDN behavior is not a theorem

Cache hit ratio and request collapse depend on implementation and traffic shape.

**Research gate:** report real measurements and provide a no-cache fallback capacity model.

### 23.5 Dual-lane drift

Active and spectator paths can temporarily disagree or expose different versions.

**Research gate:** lane handoff must compare state hashes; divergence must trigger recovery rather than silent continuation.

### 23.6 Dual-write failure

Database commit and stream append are separate failure domains.

**Research gate:** transactional outbox and reconciliation survive crash injection without loss or conflicting duplicate content.

### 23.7 Single authority risk

A single semantic sequencer is a failure and concentration point.

**Research gate:** deterministic restart from a committed snapshot and log; defined read-only behavior during authority loss; recovery-time objective.

### 23.8 Regional advantage

A near-sequencer user can have lower latency.

**Research gate:** controlled regional experiments; published win-rate skew; a mitigation threshold chosen before results are known.

### 23.9 Provider dependency

A stream or edge platform can change limits, pricing, or availability.

**Research gate:** adapter contract and a tested alternative implementation.

### 23.10 Fork abuse

Forkable history can multiply storage and computation.

**Research gate:** hard quotas, retention classes, and worst-case cost tests.

### 23.11 Commitment is not execution proof

A root proves correspondence to a manifest, not correct evaluation.

**Research gate:** independent replay witnesses and evaluator differential tests.

### 23.12 Uncertain novelty

The architecture combines known ideas: sequencing, microbatching, Merkle commitments, event sourcing, transactional outbox, relay fan-out, stream replay, and state hashes.

**Research gate:** prior-art review must distinguish the specific synthesis and workload semantics from claims that the individual components are new.

---

## 24. Promotion criteria

EpochCast should remain `experimental` until all of the following are true:

1. The protocol schema is versioned and implemented by at least two independent components.
2. Replay from a snapshot plus stream reaches the canonical state hash across a large generated corpus.
3. Simultaneous Equal tests show no duplicate mint, negative balance, stale charge, or edition collision.
4. Fault injection validates outbox recovery and lane convergence.
5. Epoch memory remains bounded during overload.
6. Full EpochCast materially improves authoritative CPU, request count, or spectator cost over the simpler relay baseline at a stated audience size.
7. Active p99 latency remains within the chosen product budget.
8. Regional fairness metrics meet a published threshold.
9. Provider fallback is demonstrated.
10. Security and publication-safety reviews pass.

A failed benchmark is valuable evidence and should be recorded in CCL rather than hidden.

---

## 25. Relationship to CCL

CCL — Causal Context Ledger — stores the epistemic status of EpochCast claims.

Examples:

```text
canonical:
  Open Calculator requires one authoritative result order.

experimental:
  40 ms is an appropriate active epoch target.

unverified:
  shared stream chunks will achieve a high request-collapse ratio.

rejected:
  every spectator should hold a direct sequencer connection.

quarantined:
  a benchmark result with incomplete environment metadata.
```

CCL records protocol versions, benchmark environments, failed experiments, superseded ordering rules, evidence references, and the next promotion gate. It prevents an attractive architecture diagram from silently becoming an asserted production fact.

---

## 26. Relationship to GPT-5.6 and Codex

SAI EpochCast was synthesized in a GPT-5.6-assisted design process. That provenance is intentionally public because the hackathon evaluates not only the product but also how advanced models participate in technical creation.

The human project direction supplied the game, priorities, constraints, and demand for an extreme communication design. SAI synthesized the two-lane commitment architecture, named the protocol, organized its failure model, and converted speculative ideas into a testable specification.

Codex is expected to implement and verify bounded parts of the protocol:

- message and manifest schemas;
- canonical encoding;
- gateway epoch folding;
- sequencer transition logic;
- Equal cut tests;
- transactional outbox;
- stream adapter;
- replay witness;
- property and fault-injection tests;
- benchmark harness;
- X-RAY instrumentation.

Neither model output nor generated code is accepted as truth without tests and review.

---

## 27. Minimal implementation sequence

### Stage 1 — direct authoritative room

Implement safe commands, sequence numbers, atomic Equal, event history, and replay.

### Stage 2 — active gateway and relay

Add bounded microbatching and a relay tree while preserving the same state-machine semantics.

### Stage 3 — manifest commitments

Add canonical epoch manifests, roots, transition capsules, and independent replay verification.

### Stage 4 — spectator stream

Add outbox publication, offset reads, snapshots, and spectator lag disclosure.

### Stage 5 — dual-lane handoff

Allow clients to switch modes only through state-hash-verified handoff.

### Stage 6 — fairness and fault injection

Measure regions, overload, crashes, duplicates, gaps, stale Equals, and stream failures.

### Stage 7 — experimental forks

Add bounded forks and Proof of Birth bundles after core invariants are stable.

---

## 28. Final statement

EpochCast is intentionally larger than the calculator interface that inspired it. The interface is small enough that failures cannot hide behind product complexity: every ordering choice changes a visible formula, and every Equal race creates or denies ownership.

The protocol’s ambition is not to make a server magically serve an infinite world. Its ambition is to make the boundary clean:

- authority decides and commits;
- relays serve active immediacy;
- streams serve public observation and history;
- hashes and witnesses make convergence inspectable;
- CCL records what is known, what failed, and what remains hypothetical.

> **The authority processes commitments, not audiences.**

That sentence is the design thesis. The benchmark results will decide whether it becomes an engineering contribution.

---

## References

1. Cloudflare, “Use WebSockets — Durable Objects,” including the Hibernation WebSocket API and batching guidance. Accessed 2026-07-16. https://developers.cloudflare.com/durable-objects/best-practices/websockets/
2. OpenAI, “Structured model outputs,” for schema-constrained model responses used elsewhere in Open Calculator. Accessed 2026-07-16. https://developers.openai.com/api/docs/guides/structured-outputs
3. OpenAI, “Codex cloud,” for the coding-agent workflow referenced by the implementation plan. Accessed 2026-07-16. https://learn.chatgpt.com/docs/cloud

Provider documentation supports candidate implementation choices. It does not validate EpochCast’s unmeasured performance claims.
