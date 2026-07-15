# Open Problems and Falsifiable Research Gates

**Status:** canonical list of known weaknesses; mitigations remain experimental until verified

Open Calculator is intentionally published with its weaknesses. Each weakness is paired with a research question, candidate mitigation, and evidence required for promotion.

---

## 1. Distributed order is protocol order, not physical truth

### Weakness

Commands from distant regions do not have a universally observable real-world order. A sequencer or epoch rule creates an order; it does not discover an absolute one.

### Candidate work

- compare receipt order, fairness windows, deterministic tie-breaks, and previous-root-derived ordering;
- publish gateway inclusion evidence;
- measure regional win-rate skew;
- explore blinded commitments for high-value Equal races.

### Pass condition

Independent replay derives the same order, and regional inclusion and win-rate skew remain within a threshold chosen before results are evaluated.

---

## 2. Equal cut semantics can be ambiguous

### Weakness

A digit and an Equal intent can arrive near the same epoch boundary. Without an explicit contract, users cannot know which expression was claimed.

### Candidate work

- versioned Equal Cut Manifest;
- active gateway seal on Equal;
- deterministic included and excluded command ranges;
- no-charge stale rule;
- independent cut replay.

### Pass condition

Every race produces one winner, one exact included range, zero stale charges, and one reproducible post-state hash.

---

## 3. Short epochs can still contain too much data

### Weakness

A 40 ms window bounds time, not command count or bytes. A burst can exhaust memory or increase latency.

### Candidate work

- maximum commands and encoded bytes per epoch;
- actor-specific limits;
- early seal;
- bounded pending-epoch count;
- explicit overload and read-only modes.

### Pass condition

Memory and queue depth remain bounded under adversarial traffic, and overload behavior is visible and deterministic.

---

## 4. Spectator distribution does not become free

### Weakness

Separating a spectator stream from authority can reduce direct sequencer fan-out, but total bandwidth, storage, cache misses, and egress still grow.

### Candidate work

- immutable aligned chunks;
- compact transition capsules;
- snapshots plus deltas;
- cursor sharing;
- cache-friendly delivery;
- no-cache fallback capacity model.

### Pass condition

Full EpochCast materially improves authoritative request or CPU cost against the relay baseline at a stated audience size without exceeding the latency budget.

---

## 5. CDN request collapse is not guaranteed

### Weakness

Intermediary behavior depends on cache keys, timing, product semantics, regional distribution, and configuration.

### Candidate work

- content-addressed immutable chunks;
- controlled cache headers;
- aligned offset ranges;
- origin-request instrumentation;
- experiments with cache disabled and enabled.

### Pass condition

Observed cache-hit and request-collapse ratios are reproducible. Documentation reports measurement rather than assuming a platform guarantee.

---

## 6. Active and spectator lanes may drift

### Weakness

Active users may see low-latency capsules while spectators read a delayed stream. A reconnecting client can hold incompatible state.

### Candidate work

- state hash in every lane;
- Lane Handoff object;
- contiguous offset checks;
- automatic snapshot recovery;
- visible spectator lag.

### Pass condition

Every handoff either confirms the same state hash or performs explicit recovery. Silent continuation from a divergent state is impossible.

---

## 7. Database and stream writes are separate failure domains

### Weakness

A successful authoritative transaction and an external stream append are not inherently atomic.

### Candidate work

- transactional outbox;
- stable record identifiers;
- at-least-once publication;
- producer fencing;
- periodic reconciliation;
- quarantine on conflicting content.

### Pass condition

Crash injection between commit, publish, and acknowledgment creates no lost authoritative event and no conflicting duplicate stream record.

---

## 8. One authority is a concentration and failure point

### Weakness

A single semantic sequencer simplifies ordering but centralizes availability and may create regional latency advantage.

### Candidate work

- durable snapshots;
- deterministic replay recovery;
- visible read-only degradation;
- warm standby evaluation;
- room or season partitioning without splitting one round’s authority.

### Pass condition

After injected failure, the service restores the exact committed state within a published objective and accepts no writes while authority is uncertain.

---

## 9. Regional fairness is unresolved

### Weakness

Users closer to the authority or on better gateways may win more Equal races.

### Candidate work

- regional latency classes in load tests;
- fairness windows;
- regional bundle quotas;
- randomized deterministic tie-breaks;
- public fairness telemetry.

### Pass condition

A published analysis separates intentional order policy from network advantage and meets a predetermined fairness threshold.

---

## 10. Provider dependency can invalidate assumptions

### Weakness

Limits, behavior, pricing, and availability of edge, WebSocket, stream, queue, and storage products can change.

### Candidate work

- infrastructure adapters;
- pinned compatibility and protocol versions;
- provider capability checks;
- alternative outbox and stream implementation;
- recurring cost benchmark.

### Pass condition

The core state machine and replay tests run against a second implementation, and provider-specific claims are revalidated before release.

---

## 11. Merkle roots do not prove correct execution

### Weakness

A root proves correspondence to committed bytes. It does not prove fair admission, valid commands, correct arithmetic, or correct economic settlement.

### Candidate work

- canonical manifest publication;
- deterministic evaluator;
- independent replay witnesses;
- differential evaluator tests;
- Proof of Birth bundles.

### Pass condition

At least one independent witness reproduces the committed result and post-state hash from a trusted snapshot and manifest range.

---

## 12. Safe numeric evaluation is difficult at extreme scale

### Weakness

Huge exponents, decimal expansion, primality checks, and pathological expressions can consume unbounded resources or produce inconsistent results.

### Candidate work

- constrained grammar;
- exact integer and explicit decimal policy;
- node, depth, digit, exponent, time, and memory limits;
- symbolic or logarithmic result representation;
- deterministic error codes;
- differential TypeScript and Rust/WebAssembly corpus.

### Pass condition

The evaluator stays within resource ceilings, produces equivalent canonical outputs across implementations, and never invokes dynamic code execution.

---

## 13. Equal Margin can be exploitable or incomprehensible

### Weakness

A complicated fee can be gamed, feel arbitrary, or price ordinary players out of meaningful claims.

### Candidate work

- inspectable component breakdown;
- player maximum-fee guard;
- simulation against generated strategies;
- anti-spam floor separated from value premium;
- seasonally versioned coefficients.

### Pass condition

Players can predict the fee, low-value spam remains lossy, and no simple expression family produces outsized risk-free value.

---

## 14. Low-card sinks may still invite farming

### Weakness

System conversion of Dust/Common cards and login grants create automatable value sources.

### Candidate work

- negative expected low-card conversion;
- bounded grants;
- account and actor rate limits;
- anomaly detection;
- settlement delay;
- sybil-resistance experiments that do not require invasive identity collection.

### Pass condition

Automated low-value strategies do not generate positive unbounded `seg` under the published model.

---

## 15. The rarity system may collapse into digit count

### Weakness

If magnitude dominates, players optimize only for enormous numbers and ignore formula, pattern, history, and culture.

### Candidate work

- multiple capped score axes;
- orthogonal pattern and provenance value;
- registry-based Unique status;
- logarithmic magnitude contribution;
- score-distribution simulation.

### Pass condition

Top-card samples include multiple strategies and no single unbounded feature dominates the entire score.

---

## 16. Unique catalog governance may become arbitrary

### Weakness

A curated registry can reflect inconsistent taste, model hallucination, or invisible favoritism.

### Candidate work

- deterministic registry schema;
- public evidence and rationale;
- versioned additions;
- human approval;
- model proposals separated from registry authority;
- conflict and removal policy.

### Pass condition

Every registry entry has public provenance, deterministic matching, and an auditable edition history.

---

## 17. GPT-5.6 can generate false meaning

### Weakness

A model can confidently invent mathematical, historical, or cultural claims.

### Candidate work

- deterministic evidence packet;
- schema-constrained output;
- reference allowlist or tool evidence;
- uncertainty field;
- validator rejection;
- limited admission;
- visible provenance.

### Pass condition

Canonization never changes authoritative facts, unsupported claims are rejected or labeled uncertain, and a failed model call leaves the card valid.

---

## 18. Prompt injection can enter through game data

### Weakness

Expressions, proposed labels, or user-derived fields may contain text interpreted as instructions.

### Candidate work

- typed data fields;
- no concatenation of raw user text into system instructions;
- escaping and length limits;
- output policy validation;
- adversarial corpus;
- zero model authority over execution.

### Pass condition

Injection tests cannot change balances, registry, rarity, ownership, tool scope, or publication policy.

---

## 19. Canonization cost and latency can dominate

### Weakness

Calling a frontier model for every card is slow and expensive.

### Candidate work

- deterministic labels for Dust/Common;
- admission thresholds;
- asynchronous canonization;
- caching by evidence hash;
- smaller preliminary classifiers;
- Unique-only Canon Council.

### Pass condition

Gameplay settlement never waits for canonization, duplicate evidence does not create duplicate cost, and spending remains within a published budget.

---

## 20. Peak-faith levels can be inflated by temporary transfer

### Weakness

A valuable card can be lent briefly to create permanent level progress.

### Candidate work

- delayed contribution;
- gradual vesting;
- recent-transfer caps;
- custody lock;
- simulation of lending rings.

### Pass condition

Short-lived transfer cannot create the full permanent benefit, while ordinary purchases remain understandable.

---

## 21. Meaningless statistics may become secretly optimal

### Weakness

Once stat patterns affect cult points, they are no longer fully meaningless and may create a solved allocation meta.

### Candidate work

- cap profile contribution;
- reward multiple pattern families;
- make effects social rather than economic;
- rotate non-destructive interpretation layers;
- publish the contradiction as part of the design.

### Pass condition

No allocation becomes mandatory for basic economic competitiveness, and users can preserve expressive variety.

---

## 22. Cult dominance and heresy can oscillate

### Weakness

The weakest cult’s digit penalizing leaders can cause rank manipulation, unstable feedback, or deliberate last-place strategies.

### Candidate work

- fixed daily or seasonal settlement;
- lagged ranking averages;
- bounded penalty;
- anti-collusion analysis;
- simulated strategic agents.

### Pass condition

The system produces meaningful counterplay without rapid oscillation or a dominant incentive to remain last.

---

## 23. Five-second reset pressure may be unfair

### Weakness

A short reset can create excitement but punish high-latency users or erase valuable expressions unexpectedly.

### Candidate work

- define whether the timer follows inactivity, value threshold, or public opportunity state;
- server-authoritative visible countdown;
- grace policy for in-flight Equal intents;
- regional tests;
- parameter experiments.

### Pass condition

The reset is predictable, replayable, and does not erase an Equal intent that was admitted under the published cut rule.

---

## 24. Forkable history can become a storage attack

### Weakness

Users can create deep or numerous alternate timelines.

### Candidate work

- maximum forks per actor;
- maximum depth;
- retained-byte budget;
- TTL classes;
- paid or earned quota;
- content-addressed shared prefixes.

### Pass condition

Worst-case storage and compute remain bounded by configured quotas.

---

## 25. Public event history can become a privacy risk

### Weakness

Replayable events can accidentally preserve personal identity, device data, network location, or private diagnostic content.

### Candidate work

- pseudonymous actor references;
- minimal event schema;
- no raw IP, email, credential, host, or device fingerprint;
- retention policy;
- publication scanner;
- separate private abuse telemetry with legal and access review.

### Pass condition

Public replay is sufficient for state verification without exposing private identity or operational secrets.

---

## 26. Public-safety scanning can produce blind spots

### Weakness

Pattern scanners miss unknown formats and can also block harmless documentation.

### Candidate work

- fail-closed read behavior;
- tracked-file scan;
- narrow match-level documentation exemptions;
- private denylist support outside the repository;
- secret scanning in CI;
- manual public-diff review;
- tests for positive and negative fixtures.

### Pass condition

Known dangerous patterns are blocked without printing matched values, scanner errors fail the build, and every exemption is exact and tested.

---

## 27. Protocol novelty is unproven

### Weakness

SAI EpochCast combines sequencing, batching, event sourcing, Merkle commitments, outbox publication, relays, and stream replay, all of which have prior art.

### Candidate work

- formal prior-art search;
- comparison matrix;
- define the novel unit as a specific synthesis and workload contract;
- invite external critique;
- avoid patent-like or academic priority claims without evidence.

### Pass condition

Public claims clearly distinguish known components, project-specific synthesis, and measured contribution.

---

## 28. Model-generated architecture can sound more complete than it is

### Weakness

A coherent design produced by SAI may be mistaken for implemented infrastructure.

### Candidate work

- status labels in every major document;
- CCL evidence records;
- exact-head test references;
- X-RAY measured versus simulated labels;
- promotion gates.

### Pass condition

A reader can identify implemented, measured, experimental, and rejected components without relying on promotional language.

---

## 29. The hackathon scope can exceed delivery capacity

### Weakness

The full game, market, cults, AI canonization, CCL, and EpochCast are too broad to implement deeply at once.

### Candidate work

- protect P0;
- demonstrate one room, one atomic Equal race, one replay, one canonization, and one inspectable protocol slice;
- keep advanced economy and full EpochCast as research branches;
- reject simulated claims presented as production.

### Pass condition

The final demo’s critical path runs live and its invariants are backed by exact-head tests.

---

## 30. Research discipline

A weakness is considered addressed only when:

1. the threat or failure is stated precisely;
2. a mitigation is implemented or simulated under a versioned policy;
3. the evaluation environment is recorded;
4. the result is reproducible;
5. negative results remain in CCL;
6. the status changes through review rather than through prose alone.
