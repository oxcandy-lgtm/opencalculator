# Research Log

**Purpose:** preserve substantive architecture alternatives and their current status without copying private conversation metadata

This log is not chronological transcript. It is a normalized record of the ideas considered during Open Calculator design, including proposals that remain speculative or were rejected.

---

## R-001 — Direct authoritative room

**Status:** canonical P0 baseline

One authoritative room accepts commands, sequences them, applies the state machine, and broadcasts committed state.

**Value:** smallest implementation that can prove atomic Equal, idempotency, replay, and card ownership.

**Limitation:** direct fan-out can make the authority responsible for a large audience.

---

## R-002 — Hibernating WebSockets

**Status:** candidate implementation

Use a platform capable of preserving client WebSocket connections while an idle authority component is not resident in memory.

**Value:** can reduce idle compute duration for quiet rooms.

**Limitations:** active timers, outbound connections, frequent messages, and reconstruction cost must be measured. Hibernation is not a complete scalability strategy.

---

## R-003 — Active-only microbatching

**Status:** experimental

Open a short batching window only when commands arrive. The initial target is approximately 40 ms.

**Value:** reduces per-message context switching and allows deterministic epoch manifests.

**Limitations:** adds latency; time does not bound bytes; Equal requires an explicit cut.

**Alternatives:** 10, 20, 80, and 160 ms windows; count-based sealing; hybrid time-and-count sealing.

---

## R-004 — Gateway Durable Objects or equivalent edge collectors

**Status:** experimental topology

Regional or partitioned gateways authenticate, validate, rate-limit, assign local sequence, fold commands, and send canonical bundles to the authority.

**Value:** bounds connection and command-processing work at the authority.

**Limitation:** gateways can introduce admission bias, gaps, duplication, and regional asymmetry.

---

## R-005 — Static relay tree

**Status:** experimental but near-term

The authority sends committed transition capsules to a bounded relay topology rather than iterating directly over all active clients.

**Value:** separates semantic state work from active connection fan-out.

**Limitation:** relay lag, topology management, and backpressure require explicit handling.

---

## R-006 — Spectator stream

**Status:** experimental

Committed epochs and snapshots are appended to a durable stream. Spectators consume by offset through SSE, long-poll, or another cache-friendly read interface.

**Value:** high-volume observers do not need direct authoritative connections.

**Limitations:** stream dependency, publication lag, request collapse uncertainty, and dual-lane coherence.

---

## R-007 — SAI EpochCast Coherence Protocol

**Status:** experimental standalone protocol

Combine gateway epoch folding, deterministic ordering, manifest commitments, transition capsules, Equal Strong Path, active relays, transactional outbox, spectator stream, offset recovery, lane handoff, replay, and bounded forks.

**Thesis:** the authority processes commitments, not audiences.

**Promotion:** requires baseline comparison, fault injection, regional fairness analysis, and exact replay.

---

## R-008 — Epoch-Coherent Zero-ish Mode

**Status:** experimental framing

The marginal authoritative work for a large spectator audience should approach a bounded epoch-commitment operation rather than a direct action per observer.

**Clarification:** “zero-ish” does not mean zero messages, zero bandwidth, or zero cost.

---

## R-009 — Deterministic previous-root ordering

**Status:** experimental ordering candidate

Use the previous epoch root, gateway identity, local sequence, and command identifier to derive a deterministic tie-break key.

**Value:** reduces discretionary post-hoc ordering by the sequencer.

**Limitations:** gateways can still manipulate admission; deterministic does not automatically mean fair.

---

## R-010 — Receipt-order sequencing

**Status:** baseline candidate

Order commands by authoritative receipt.

**Value:** simple and easy to explain.

**Limitation:** strongly favors network proximity and scheduler behavior.

---

## R-011 — Fairness windows

**Status:** experimental

Collect commands within a short window, then apply a public tie-break or region-aware interleaving.

**Value:** may reduce deterministic proximity advantage.

**Limitations:** adds latency, may be strategically gamed, and does not create physical simultaneity.

---

## R-012 — Commit-reveal ordering for high-value rounds

**Status:** deferred research

Players or gateways commit to commands before reveal so the final order cannot be selected after observing content.

**Value:** stronger manipulation resistance for exceptional rounds.

**Limitations:** latency, failed reveals, user complexity, sybil behavior, and unsuitable overhead for ordinary keypresses.

---

## R-013 — Merkle-root epoch commitment

**Status:** experimental protocol component

Commit to the ordered canonical epoch manifest with a Merkle root.

**Value:** supports compact integrity evidence and partial proofs.

**Limitation:** does not prove valid admission, correct execution, or fair order.

---

## R-014 — Incremental transition capsule

**Status:** experimental protocol component

Broadcast the minimum committed delta and hash chain needed to advance state rather than a full snapshot on each command.

**Value:** reduces repetitive payload.

**Limitation:** clients need gap detection and snapshot recovery.

---

## R-015 — Transactional outbox

**Status:** canonical requirement when external publication exists

Write intended stream publication inside the authoritative transaction, then publish idempotently.

**Value:** recovers from crashes between state commit and external append.

**Limitations:** publication is delayed, at-least-once, and requires reconciliation and producer fencing.

---

## R-016 — Offset-based recovery

**Status:** experimental

Readers resume from the last trusted stream offset and state hash. Large gaps use a snapshot plus later deltas.

**Value:** reconnect does not require replaying all history.

**Limitation:** retention, expired offsets, snapshot integrity, and state-hash handoff require rules.

---

## R-017 — Forkable calculation history

**Status:** P2 research

Create an alternate timeline from a committed stream offset without altering canonical history.

**Uses:** bug reproduction, evaluator comparison, alternative ordering, economy experiments, card-birth exploration.

**Limitation:** storage and computation abuse.

---

## R-018 — Asynchronous Proof of Birth

**Status:** experimental

After card mint, package cut manifest, epoch roots, expression, evaluator version, feature commitment, ownership event, state hash, and replay witness results.

**Value:** makes card provenance inspectable without delaying the mint transaction.

**Limitation:** proof can remain pending or fail after ownership already exists; status must be visible.

---

## R-019 — Independent replay witness

**Status:** canonical verification direction

A component independent from the main transition path replays committed manifests and confirms the resulting state hash.

**Value:** catches evaluator, serialization, or state-transition divergence.

**Limitation:** a witness sharing the same bug is not fully independent; differential implementations are preferable.

---

## R-020 — TypeScript full evaluator

**Status:** baseline candidate

Implement the complete parser and evaluator in TypeScript.

**Value:** development speed and direct integration.

**Limitation:** performance and pause behavior must be measured under extreme expressions.

---

## R-021 — Rust/WebAssembly full evaluator

**Status:** experimental candidate

Implement equivalent semantics in Rust compiled to WebAssembly.

**Value:** potential predictable performance and shared implementation across environments.

**Limitations:** cold start, boundary transfer, binary size, build complexity, and semantic divergence.

---

## R-022 — Rust/WebAssembly incremental evaluator

**Status:** experimental candidate

Maintain a transition-oriented representation that updates only the changed expression state.

**Value:** may avoid complete re-evaluation after every keypress.

**Limitations:** greater state complexity and difficult equivalence proof.

---

## R-023 — Rateless reconciliation

**Status:** deferred research

Consider coding or reconciliation schemes that allow readers to recover missing state from independent encoded pieces rather than requesting exact lost messages.

**Potential value:** robust catch-up under lossy or fragmented delivery.

**Reason deferred:** complexity is excessive before ordinary offset and snapshot recovery is measured.

---

## R-024 — WebTransport

**Status:** rejected for P0; may be revisited

Use a transport with multiplexed streams and datagrams.

**Potential value:** flexible low-latency channels.

**Reason rejected for P0:** browser and platform complexity, operational maturity, and lack of necessity for proving the core semantics.

---

## R-025 — Browser Cache API as authoritative distribution

**Status:** rejected

Rely on browser cache primitives as the coherence or authority mechanism.

**Reason rejected:** cache behavior does not define authoritative ordering or atomic ownership and is not a substitute for a server-side event log.

---

## R-026 — Reinforcement-learned batching policy

**Status:** rejected for early stages

Train a policy to adjust epoch windows and sealing behavior dynamically.

**Potential value:** workload adaptation.

**Reason rejected:** obscures fairness and causality before fixed deterministic policies are understood. Simpler adaptive rules should be evaluated first.

---

## R-027 — FPGA sequencer

**Status:** speculative long-term research

Implement ordering or evaluation acceleration in dedicated programmable hardware.

**Potential value:** deterministic high-throughput processing.

**Reason deferred:** irrelevant to hackathon P0, operationally complex, and unjustified before software bottlenecks are measured.

---

## R-028 — Object storage for long history

**Status:** candidate support layer

Move immutable old manifests, snapshots, proofs, or fork prefixes to low-cost object storage.

**Value:** separate hot authority state from cold history.

**Limitation:** retrieval latency and lifecycle consistency; not appropriate for current transaction authority.

---

## R-029 — SQL-backed authoritative state

**Status:** candidate baseline

Use transactional SQL storage for balances, editions, cards, events, idempotency, and outbox.

**Value:** explicit constraints and atomicity.

**Limitation:** hot-room write throughput and platform-specific transaction behavior must be measured.

---

## R-030 — Model-decided rarity

**Status:** rejected

Ask GPT-5.6 to choose rarity or Unique status directly.

**Reason rejected:** nondeterminism and semantic persuasion cannot control scarce authoritative state.

---

## R-031 — Model-decided market price

**Status:** rejected

Ask the model to set authoritative card prices.

**Reason rejected:** market settlement must be explicit, user-directed, and reproducible.

---

## R-032 — Model-generated canonization

**Status:** canonical AI direction

Use GPT-5.6 to turn deterministic evidence into names, descriptions, tags, interpretations, and uncertainty under a strict schema and validator.

**Value:** transforms raw calculation into memorable social meaning.

**Limitation:** hallucination, repetition, cultural error, prompt injection, latency, and cost.

---

## R-033 — Canon Council

**Status:** optional stretch research

Use specialized model roles for mathematics, cultural context, skepticism, and judgment on exceptional candidates.

**Value:** richer criticism and visible reasoning diversity.

**Limitation:** more cost and complexity without authority benefit.

---

## R-034 — Five-second opportunity reset

**Status:** experimental product pressure

Reset an unclaimed valuable or inactive expression after a short visible window.

**Value:** prevents indefinite waiting and creates urgency.

**Unresolved:** exact trigger, in-flight Equal grace, regional fairness, and whether five seconds is appropriate.

---

## R-035 — Seven-segment material score

**Status:** canonical design surface

Assign each digit the count of lit segments in a conventional seven-segment display.

**Value:** creates a material dimension distinct from magnitude and culture.

---

## R-036 — Fixed professions

**Status:** superseded

An earlier direction considered fixed player professions.

**Replacement:** every player is a digit cultist; strategic roles emerge from cult rank.

**Reason:** one number-centered social system is more coherent than unrelated class selection.

---

## R-037 — Cult rank roles

**Status:** experimental

Top cults pursue dominance, middle cults farm low-card value, and the lowest cult becomes Inquisitor.

**Risk:** oscillation, collusion, and incentive to remain last.

---

## R-038 — Intentionally meaningless RPG stats

**Status:** canonical product experiment

Grant familiar statistics that do not create normal combat power but whose numerical patterns can carry identity.

**Value:** explores socially created meaning.

**Paradox:** once stats affect cult interpretation, they are not entirely meaningless; this tension is intentional and must remain economically bounded.

---

## R-039 — CCL evidence ledger

**Status:** canonical public architecture

Separate current state, append-only history, reference index, compact generated views, and sanitized quarantine metadata.

**Value:** prevents model-generated coherence or promotional prose from silently promoting an experiment to fact.

---

## R-040 — Fail-closed publication scan

**Status:** canonical

Scan tracked text, fail on read errors, support narrow documentation examples, and report findings without matched secret values.

**Value:** allows Open Calculator, SAI, EpochCast, CCL, and public technologies to remain visible while excluding dangerous private material.
