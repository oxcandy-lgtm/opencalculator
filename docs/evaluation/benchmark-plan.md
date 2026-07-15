# Open Calculator Benchmark and Validation Plan

**Status:** experimental evaluation contract  
**Rule:** no performance, scale, fairness, or cost target becomes a project fact until this plan produces reproducible evidence

---

## 1. Objectives

The benchmark program must answer five different questions without collapsing them into one score.

1. **Correctness:** does the authoritative state machine produce one replayable truth?
2. **Settlement safety:** can concurrent Equal attempts create a duplicate charge, card, edition, or reset?
3. **Latency:** does active interaction remain usable under realistic and adversarial load?
4. **Audience efficiency:** does SAI EpochCast reduce authoritative work for spectator-heavy traffic relative to simpler baselines?
5. **Fairness:** how much advantage is created by region, gateway, timing strategy, and ordering policy?

A system can be fast and wrong, correct and unusable, cheap and unfair, or impressive only under a favorable synthetic workload. Results are therefore reported as a vector, not a single victory number.

---

## 2. Exact-head evidence

Every report records:

```text
repository commit
branch or pull request
working-tree state
protocol version
evaluator version
schema versions
benchmark harness version
runtime and platform versions
region or topology class
configuration hash
dataset or seed
start and end time
```

A result from one commit does not certify a later commit. Dirty or incomplete environments are classified rather than silently accepted.

---

## 3. Architectures under comparison

### A. Direct authority plus direct fan-out

Every command reaches the authoritative component, is applied, and is sent directly to all connected clients.

Purpose: establish the simplest understandable baseline.

### B. Gateway batching plus active relay tree

Commands are collected into bounded batches, committed by the authority, and distributed through relays. All clients still use the active lane.

Purpose: isolate the value of batching and bounded fan-out.

### C. Active relays plus spectator stream

State-affecting users use architecture B. Spectators consume committed events and snapshots through an append-only stream.

Purpose: isolate separation of active and spectator traffic.

### D. Full SAI EpochCast

Adds active-only micro-epochs, deterministic manifests, Merkle roots, transition capsules, Equal Cut Manifest, transactional outbox, stream offsets, state-hash handoff, and replay witnesses.

Purpose: test the complete research hypothesis.

---

## 4. Workload classes

### 4.1 Quiet room

- few active users;
- many idle WebSocket connections;
- occasional command;
- long inactive periods.

Measures hibernation behavior, idle cost, wake latency, and timer discipline.

### 4.2 Balanced play

- moderate active population;
- mixed digits, operators, deletes, and Equal;
- ordinary spectator population;
- realistic reconnects.

Measures product-like behavior.

### 4.3 Spectator-heavy event

- small active population;
- spectator population grows by orders of magnitude;
- high read fan-out but normal command rate.

Measures the central EpochCast audience-separation claim.

### 4.4 Input storm

- many simultaneous keypresses;
- few spectators;
- commands near epoch count and byte ceilings.

Measures authority, gateway, and memory pressure.

### 4.5 Equal sniper race

- many actors observe the same valuable expression;
- simultaneous or near-simultaneous Equal intents;
- retry after dropped responses;
- mixed regional latency.

Measures settlement correctness and fairness.

### 4.6 Malformed and expensive expressions

- invalid syntax;
- extreme nesting;
- huge exponents;
- division by zero;
- unsupported operators;
- expensive mathematical feature candidates.

Measures evaluator bounds and denial-of-service resistance.

### 4.7 Reconnect wave

- large connection loss;
- clients return with mixed offsets and state hashes;
- some offsets are retained, some expired.

Measures snapshot and delta recovery.

### 4.8 Fork pressure

- repeated forks from shared and distinct offsets;
- deep chains;
- quota exhaustion;
- repeated replay.

Measures history sharing and retention bounds.

### 4.9 Canonization burst

- many Rare+ mints;
- duplicate evidence hashes;
- model timeout and invalid schema;
- admission budget exhaustion.

Measures asynchronous AI behavior without blocking settlement.

---

## 5. Synthetic actor strategies: Chaos Cult

The load generator assigns deterministic strategies.

### Digit Zealot

Repeatedly contributes one cult digit within rate limits.

### Formula Builder

Attempts valid structured expressions and delays Equal.

### Equal Sniper

Watches margin and deterministic rarity preview, then claims near thresholds.

### Reckless Claimer

Presses Equal frequently, exposing low-card economic loss.

### Saboteur

Uses deletes and operators to invalidate or alter a candidate expression within permitted game rules.

### Malformed Attacker

Sends invalid protocol messages and evaluator edge cases.

### Reconnecting Spectator

Drops and resumes from offsets with varied lag.

### Market Farmer

Generates low cards and tests Segmentization economics.

### Fork Archivist

Creates alternate histories within and beyond quotas.

### Regional Classes

Actors are assigned controlled delay and jitter profiles rather than pretending all clients are local.

All randomness uses recorded seeds.

---

## 6. Correctness metrics

### Sequence

- duplicate global sequence count;
- missing committed sequence count;
- command identifier duplication;
- gateway-local sequence gaps;
- epoch-root chain breaks.

### State

- replay state-hash mismatches;
- active versus spectator divergence;
- snapshot plus delta mismatch;
- non-canonical serialization differences.

### Economy

- negative balances;
- debit without card;
- card without debit;
- duplicate ownership event;
- market double-spend;
- invalid low-card conversion.

### Equal

- winners per round;
- stale charges;
- duplicate idempotency effects;
- duplicate editions;
- mint/reset separation;
- cut-manifest ambiguity.

The expected count for every violation is zero.

---

## 7. Latency metrics

Record full distributions rather than averages.

### Active command

```text
client send
→ gateway receive
→ epoch admission
→ epoch seal
→ sequencer commit
→ relay receive
→ client committed display
```

Report p50, p95, p99, maximum, and timeout rate.

### Equal

```text
Equal send
→ cut established
→ transaction begin
→ evaluation complete
→ commit
→ receipt displayed
```

Separate winning, stale, insufficient-balance, invalid-expression, and retry paths.

### Spectator

```text
sequencer commit
→ outbox publish
→ stream visibility
→ intermediary response
→ spectator display
```

Report lag and visible offset distance.

### Recovery

- time to detect gap;
- time to obtain snapshot or delta;
- bytes transferred;
- time to verified state hash;
- time until writes are permitted again.

---

## 8. Resource metrics

- CPU time by gateway, sequencer, relay, publisher, evaluator, and witness;
- memory and peak resident set where measurable;
- open connections;
- pending epoch count;
- command and byte size per epoch;
- relay queue depth;
- database operations;
- outbox backlog;
- stream writes and reads;
- origin requests;
- cache hits and misses;
- total and per-user egress;
- snapshot storage;
- fork retained bytes;
- model requests, tokens, latency, and cost class.

Vendor-reported analytics and harness-side observations should be distinguished.

---

## 9. Fairness metrics

### Regional inclusion

For commands sent under controlled schedules, report admission probability and latency by region class.

### Equal win rate

Control for intended client send time and strategy, then report winning probability by region and gateway.

### Ordering-policy sensitivity

Replay the same generated arrivals under candidate ordering policies and compare:

- winner changes;
- regional skew;
- expression validity;
- user-visible churn;
- latency cost.

### Shedding fairness

Under overload, report rejection and downgrade rate by region, actor, command type, and connection age.

A fairness policy must define acceptable thresholds before the benchmark run to avoid selecting a flattering interpretation after the fact.

---

## 10. EpochCast-specific metrics

- epochs per second;
- commands and bytes per epoch;
- seal-reason distribution;
- manifest construction time;
- Merkle-root time;
- transition-capsule size;
- sequencer work per command and per epoch;
- active relay fan-out operations;
- spectator stream offsets per second;
- outbox commit-to-publish lag;
- duplicate publication rate;
- observed cache request-collapse ratio;
- lane-handoff success and recovery rate;
- witness replay delay;
- Proof-of-Birth completion latency.

The 40 ms target must be tested against alternatives such as 10, 20, 80, and 160 ms, plus count-based sealing. The final window is selected from evidence rather than attachment to the original idea.

---

## 11. Evaluator comparison

Compare:

```text
A. TypeScript full evaluator
B. Rust/WebAssembly full evaluator
C. Rust/WebAssembly incremental evaluator
```

### Corpus

- hand-written semantic cases;
- generated valid expressions;
- generated invalid expressions;
- boundary digit and exponent cases;
- decimal rounding cases;
- historical card expressions;
- adversarial deep and broad ASTs.

### Metrics

- exact output equivalence;
- error-code equivalence;
- canonical serialization equivalence;
- p50, p95, p99, and maximum evaluation time;
- cold-start time;
- warm throughput;
- memory growth;
- JavaScript/WebAssembly transfer overhead;
- binary size;
- build and maintenance complexity.

### Promotion rule

Rust/WebAssembly is promoted only if it preserves exact semantics and produces a meaningful measured benefit that justifies added complexity.

---

## 12. GPT-5.6 canonization evaluation

### Correctness boundaries

Confirm that model output cannot alter:

- result;
- balance;
- Equal Margin;
- rarity;
- registry match;
- edition;
- ownership;
- event order.

### Schema

Measure:

- structured-output compliance;
- validator acceptance rate;
- unsupported reference rate;
- contradiction with deterministic evidence;
- uncertainty calibration;
- prompt-injection resistance.

### Product value

Human reviewers may rate:

- memorability;
- relevance to evidence;
- distinction among cards;
- excessive repetition;
- cultural sensitivity;
- cult usefulness.

### Cost

Report calls and cost class per 1,000 mints by rarity distribution. Settlement latency must exclude asynchronous canonization time.

---

## 13. Fault-injection suite

Inject at least:

- gateway crash with open epoch;
- duplicate bundle;
- gateway sequence gap;
- sequencer restart before commit;
- sequencer restart after commit and before response;
- crash after state/outbox commit and before stream publication;
- successful publication with lost acknowledgment;
- duplicate publisher generation;
- stream outage;
- relay delay, reordering, and disconnect;
- expired spectator offset;
- corrupted snapshot fixture;
- evaluator disagreement;
- database edition conflict;
- repeated idempotency key;
- malformed credential-like diagnostic data;
- public-safety scanner read error.

Each fault has an expected state and explicit recovery or quarantine result.

---

## 14. Scale stages

Use gradual stages rather than jumping directly to a promotional target.

```text
Stage 0: deterministic single-process model
Stage 1: local multi-client integration
Stage 2: hundreds of simulated connections
Stage 3: thousands of mixed active and spectator clients
Stage 4: multi-region controlled load
Stage 5: spectator-heavy stress
Stage 6: sustained soak and recovery
```

Advancement requires zero correctness-invariant violations at the previous stage. A scale result with correctness failures is not a performance success.

---

## 15. Cost reporting

Cost should be normalized by workload.

Examples:

```text
cost per 1,000 active users per hour
cost per 10,000 spectators per hour
cost per million accepted commands
cost per million committed spectator records
cost per 1,000 canonized cards by rarity mix
storage cost per million events and retained fork depth
```

Report assumptions, provider prices at measurement time, free-tier effects, and excluded costs. Promotional credits must not be treated as zero underlying cost.

---

## 16. Result classifications

### GREEN

All specified invariants pass; environment and exact head are complete; target metric meets the predeclared gate.

### YELLOW

Correctness is preserved but one or more performance, fairness, dependency, or completeness gates remain unresolved.

### RED

A correctness invariant fails, evidence is inconsistent, the environment is invalid, or the result cannot be reproduced.

### QUARANTINED

The report contains unsafe data, missing provenance, stale-head evidence, impossible values, or conflicting artifacts. Sanitized metadata may be retained; raw unsafe content is excluded.

---

## 17. Minimum hackathon evidence

Before final submission, the project should have exact-head evidence for:

- safe evaluator cases;
- atomic Equal success;
- simultaneous Equal race;
- stale no-charge behavior;
- idempotent retry;
- Unique edition uniqueness;
- event replay state-hash match;
- GPT structured output and deterministic rejection;
- public-safety scanner;
- one live two-device shared-state demonstration;
- one honest baseline versus experimental communication measurement, even at small scale.

A full global-scale claim is not required for the protocol to be interesting. A small reproducible result with visible limitations is stronger than an unsupported large one.

---

## 18. Report template

```yaml
benchmark_id: null
commit_sha: null
working_tree_clean: null
architecture: null
protocol_version: null
environment:
  runtime: null
  topology: null
  regions: []
  provider_services: []
workload:
  seed: null
  active_clients: null
  spectators: null
  duration_seconds: null
  strategy_mix: {}
correctness:
  invariant_violations: null
  replay_hash_mismatches: null
  stale_charges: null
  duplicate_mints: null
performance:
  active_latency_ms: {}
  spectator_lag_ms: {}
  commands_per_second: null
resource:
  origin_requests: null
  egress_bytes: null
  cpu_measurements: {}
fairness:
  regional_inclusion: {}
  equal_win_rate: {}
classification: null
limitations: []
evidence_refs: []
```

Unknown fields remain `null`; they are not estimated after the run.
