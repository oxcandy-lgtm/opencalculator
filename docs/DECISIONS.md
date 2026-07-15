# Decision Ledger

This document is a human-readable companion to CCL. It records current decisions, experimental choices, superseded assumptions, and rejected approaches without exposing private operational context.

---

## DEC-001 — One shared authoritative expression

**Status:** canonical  
**Decision:** A room has one authoritative round and expression. Accepted commands are ordered and applied without voting.  
**Reason:** The shared expression is the product’s central social and distributed-systems mechanic.

---

## DEC-002 — Equal creates ownership

**Status:** canonical  
**Decision:** Pressing `=` is a paid settlement attempt. One valid attempt can mint the current result as a number card and reset the round.  
**Reason:** Ownership transforms calculation into a timing and collection game.

---

## DEC-003 — Stale Equal attempts are free

**Status:** canonical  
**Decision:** An Equal attempt that loses because its observed round is stale is rejected without charging `seg`.  
**Reason:** The user must not pay for ownership the authority cannot grant.

---

## DEC-004 — Equal settlement is atomic

**Status:** canonical  
**Decision:** Debit, evaluation, card mint, Unique edition, ownership, event append, outbox record, and reset commit together.  
**Reason:** Partial success would create irreversible economic contradictions.

---

## DEC-005 — No dynamic expression execution

**Status:** canonical  
**Decision:** Expressions use a constrained parser and evaluator. JavaScript `eval`, dynamic functions, shell execution, and equivalent escapes are prohibited.  
**Reason:** Determinism, safety, resource control, and replay require explicit semantics.

---

## DEC-006 — `seg` is the game unit

**Status:** canonical product direction  
**Decision:** The currency is named `seg`, derived from seven-segment displays.  
**Reason:** It links calculation, visual material, and economy.

---

## DEC-007 — Equal Margin rises with the opportunity

**Status:** experimental formula, canonical principle  
**Decision:** Claim cost increases through deterministic factors related to magnitude, structure, risk, and congestion.  
**Reason:** Valuable or extremely large results must not remain cheap to mint, and frequent low-value claiming should be lossy.

---

## DEC-008 — Low cards are system-only

**Status:** canonical MVP direction  
**Decision:** Dust and Common cards cannot be listed on the initial public marketplace. They are sold to the system or Segmentized.  
**Reason:** This creates an economic sink and prevents low-value spam from flooding the market.

---

## DEC-009 — Rare and higher cards may be traded

**Status:** experimental MVP feature  
**Decision:** A fixed-price `seg` marketplace is sufficient for the first public implementation.  
**Reason:** Fixed price demonstrates ownership transfer without auction complexity.

---

## DEC-010 — Unique is catalog-backed, not one-of-one

**Status:** canonical  
**Decision:** Unique cards belong to a registry and can have multiple issued editions.  
**Reason:** Repeated discovery remains possible while catalog identity and edition scarcity preserve collectibility.

---

## DEC-011 — Edition numbers are meaningful evidence

**Status:** canonical product direction  
**Decision:** Every Unique issuance receives a deterministic edition number that may contribute to cult or collector meaning.  
**Reason:** The history of acquisition becomes part of the object rather than metadata discarded after minting.

---

## DEC-012 — Deterministic code owns rarity

**Status:** canonical  
**Decision:** Rarity, score, registry matching, edition allocation, and economic facts are deterministic.  
**Reason:** A model proposal cannot be the final authority for scarce ownership.

---

## DEC-013 — GPT-5.6 canonizes meaning

**Status:** canonical model boundary  
**Decision:** GPT-5.6 may generate schema-constrained names, descriptions, semantic tags, mathematical or cultural readings, cult interpretations, and uncertainty.  
**Reason:** Meaning benefits from model synthesis, while truth and settlement remain inspectable.

---

## DEC-014 — Canonization is asynchronous and selective

**Status:** canonical principle, experimental thresholds  
**Decision:** Common low-value cards normally bypass frontier-model calls. Strong candidates are admitted by deterministic policy after ownership is settled.  
**Reason:** Gameplay must not wait for model latency, and cost must remain bounded.

---

## DEC-015 — Canon Council is a stretch goal

**Status:** experimental  
**Decision:** A mathematician, cultural archivist, skeptic, and judge model workflow may evaluate Unique candidates later.  
**Reason:** Multiple roles can improve criticism and provenance, but are not required for P0.

---

## DEC-016 — Players align with digits

**Status:** experimental product system  
**Decision:** Players choose a digit from `0` to `9`, preferably locked for a season.  
**Reason:** The entire social world should emerge from number identity rather than conventional character classes.

---

## DEC-017 — Cult roles depend on rank

**Status:** experimental  
**Decision:** Top three cults are dominant, ranks four through nine are Farmers, and the lowest cult becomes Inquisitor.  
**Reason:** Rank should change strategic identity rather than only display a leaderboard position.

---

## DEC-018 — The weakest digit becomes heresy

**Status:** experimental  
**Decision:** The lowest cult’s digit can reduce the value of dominant cards containing it.  
**Reason:** Weakness becomes a counterweight to dominance and creates negative feedback.

---

## DEC-019 — Role changes use settlement cadence

**Status:** experimental  
**Decision:** Cult roles update at fixed daily or seasonal settlement boundaries rather than continuously.  
**Reason:** Continuous feedback could oscillate too quickly and become incomprehensible.

---

## DEC-020 — Level uses historical peak faith

**Status:** experimental  
**Decision:** Level derives from historical peak qualified inventory score and never decreases.  
**Reason:** Selling cards should not erase progression.

---

## DEC-021 — Peak contribution needs anti-lending delay

**Status:** experimental  
**Decision:** Recently transferred cards should contribute after a delay or gradual settlement.  
**Reason:** Temporary lending must not create permanent full progression.

---

## DEC-022 — Sacred levels remain in history

**Status:** canonical product direction  
**Decision:** Levels aligned with a player’s digit remain recorded after the player advances.  
**Reason:** Monotonic progression should not destroy a socially meaningful milestone.

---

## DEC-023 — Statistics are intentionally non-combat

**Status:** canonical product direction  
**Decision:** ATK, DEF, VIT, AGI, LUK, INT, FAI, and HER do not grant ordinary combat power. Their pattern may carry profile or cult meaning.  
**Reason:** The system explores how users create meaning from numerical arrangement without conventional utility.

---

## DEC-024 — Event sourcing preserves birth history

**Status:** canonical architecture  
**Decision:** Accepted state transitions record sequence, round, command, and before/after state commitments.  
**Reason:** Cards must be replayable and ownership must have an inspectable causal history.

---

## DEC-025 — X-RAY mode exposes the machine

**Status:** canonical product requirement  
**Decision:** The normal interface stays simple; X-RAY reveals sequence, state hash, latency, Equal transaction stages, edition allocation, replay, and model evidence.  
**Reason:** Technical claims should be inspectable during the demo.

---

## DEC-026 — CCL is public

**Status:** canonical  
**Decision:** CCL — Causal Context Ledger — may be named publicly and used as the project’s evidence and decision layer.  
**Reason:** Open Calculator needs an explicit distinction between truth, hypothesis, failure, and superseded design.

---

## DEC-027 — SAI provenance is public

**Status:** canonical  
**Decision:** SAI is publicly credited as the GPT-5.6 design agent that synthesized EpochCast under human direction.  
**Reason:** Model-assisted technical creation is part of the hackathon contribution.

---

## DEC-028 — EpochCast receives a standalone paper

**Status:** canonical publication decision  
**Decision:** SAI EpochCast Coherence Protocol is documented independently and prominently.  
**Reason:** Its architecture, weaknesses, and validation program are substantial enough to stand as a separate research artifact.

---

## DEC-029 — Authority and audience are separate concerns

**Status:** experimental architecture, canonical thesis  
**Decision:** The authority processes ordered commitments; relays and a stream-oriented lane serve active and spectator audiences.  
**Reason:** A large observing population should not force direct semantic-authority work per observer.

---

## DEC-030 — Micro-epoch target begins at 40 ms

**Status:** experimental  
**Decision:** Test an active-only 40 ms folding window against shorter, longer, and count-based alternatives.  
**Reason:** It is short enough to investigate interactive use while allowing meaningful batching, but it has no privileged status without results.

---

## DEC-031 — `=` uses a Strong Path

**Status:** experimental protocol, canonical requirement for explicit cut  
**Decision:** Equal seals or establishes an explicit epoch cut and enters atomic settlement rather than remaining an ordinary batched key.  
**Reason:** Ownership needs a uniquely replayable boundary.

---

## DEC-032 — Spectators consume committed history

**Status:** experimental  
**Decision:** High-volume spectators may use an append-only stream and offset recovery rather than direct authoritative WebSockets.  
**Reason:** Spectator lag can be tolerated if convergence and visibility are preserved.

---

## DEC-033 — Merkle root is evidence, not execution proof

**Status:** canonical truth boundary  
**Decision:** Epoch roots commit to ordered bytes but do not prove fair admission or correct evaluation.  
**Reason:** Independent replay witnesses remain necessary.

---

## DEC-034 — Transactional outbox protects publication

**Status:** canonical architecture requirement when an external stream is used  
**Decision:** Authoritative state and intended publication are committed together locally; an idempotent publisher delivers later.  
**Reason:** Local database and external stream writes are separate failure domains.

---

## DEC-035 — Forks are bounded

**Status:** experimental  
**Decision:** Alternate history may be supported with count, depth, retained-byte, and lifetime limits.  
**Reason:** Forks are useful for replay and research but can become a storage attack.

---

## DEC-036 — Rust/WebAssembly must earn adoption

**Status:** canonical evaluation rule  
**Decision:** TypeScript, full Rust/WebAssembly, and incremental Rust/WebAssembly evaluators are compared. Rust is promoted only when exact semantics and measured benefit justify complexity.  
**Reason:** Language choice is not benchmark evidence.

---

## DEC-037 — Public safety is fail-closed

**Status:** canonical  
**Decision:** Tracked text is scanned; read and enumeration errors fail; findings print rule, path, and line but not matched values; exemptions are narrow.  
**Reason:** A public research repository must not trade technical spectacle for operational exposure.

---

## DEC-038 — Open Calculator and CCL proper nouns are allowed

**Status:** canonical publication boundary  
**Decision:** Public project names and relevant public technologies are allowed. Credentials, personal information, private infrastructure, local paths, session identifiers, and unrelated private projects are blocked.  
**Reason:** The goal is selective safety, not erasing the project’s identity.

---

## DEC-039 — Targets are not results

**Status:** canonical truthfulness rule  
**Decision:** Audience size, latency, cost, cache collapse, fairness, and novelty remain unverified until measured.  
**Reason:** A coherent design document cannot substitute for reproducible evidence.

---

## DEC-040 — Protect the P0 critical path

**Status:** canonical delivery rule  
**Decision:** Live shared input, safe evaluation, atomic Equal, card mint, replay, canonization, X-RAY, and exact-head tests take priority over implementing the entire economy or protocol.  
**Reason:** A narrow live proof is stronger than a broad simulation.
