# Public Source and Claim Map

This map links major public claims to repository evidence. It is not a copy of private conversation history. It preserves substantive design provenance while excluding personal information, credentials, private infrastructure, local paths, session identifiers, and unrelated projects.

| Claim ID | Claim | Status | Primary repository evidence |
|---|---|---|---|
| OC-CORE-001 | One authoritative shared expression receives immediate accepted input. | canonical | `README.md`, `docs/paper/open-calculator-paper.md` |
| OC-CORE-002 | Equal is a paid ownership-settlement attempt. | canonical | `docs/architecture/atomic-equal.md` |
| OC-CORE-003 | Stale Equal attempts are rejected without charge. | canonical | `docs/architecture/atomic-equal.md`, `ccl/state.json` |
| OC-CORE-004 | Debit, mint, edition, event, outbox, and reset are atomic. | canonical contract | `docs/architecture/atomic-equal.md` |
| OC-SAFE-001 | Expressions use a constrained parser rather than dynamic code execution. | canonical | `docs/paper/open-calculator-paper.md`, `ccl/state.json` |
| OC-ECON-001 | `seg` is the seven-segment-inspired game unit. | canonical product direction | `README.md`, paper Section 4 |
| OC-ECON-002 | Equal Margin rises through deterministic opportunity and risk factors. | experimental formula | paper Section 4, `docs/DECISIONS.md` |
| OC-ECON-003 | Dust/Common are system-only; Rare+ may enter the MVP market. | canonical direction / experimental implementation | paper Sections 4–6 |
| OC-CARD-001 | Cards preserve result, formula, minter, fee, evidence, history, and commitments. | canonical data direction | paper Section 5 |
| OC-CARD-002 | Rarity ladder is Dust, Common, Rare, Epic, Legendary, Mythic, Unique. | canonical working taxonomy | `README.md`, paper Section 5 |
| OC-CARD-003 | Unique is registry-backed and multi-edition rather than one-of-one. | canonical | paper Section 5, `docs/DECISIONS.md` |
| OC-CULT-001 | Players align with a digit from zero through nine. | experimental | paper Section 7 |
| OC-CULT-002 | Top three cults dominate, middle cults farm, and the lowest becomes Inquisitor. | experimental | paper Section 7, `docs/research/open-problems.md` |
| OC-CULT-003 | The lowest digit can contaminate dominant cards as heresy. | experimental | paper Section 7 |
| OC-LVL-001 | Level derives from historical peak qualified inventory faith and does not decrease. | experimental | paper Section 8 |
| OC-LVL-002 | Provisional level exponent is 2.4 and requires calibration. | experimental | `README.md`, paper Section 8 |
| OC-LVL-003 | RPG-like statistics are intentionally non-combat. | canonical product direction | paper Section 8 |
| OC-AI-001 | GPT-5.6 canonizes meaning but cannot decide economic truth. | canonical boundary | paper Section 12, `ccl/state.json` |
| OC-AI-002 | Canonization uses structured evidence, schema validation, provenance, and admission control. | canonical architecture direction | paper Section 12 |
| OC-AI-003 | A multi-role Canon Council is optional and Unique-focused. | experimental stretch goal | paper Section 12 |
| OC-XRAY-001 | X-RAY exposes state, communication, Equal, replay, and model evidence. | canonical product requirement | paper Section 15 |
| OC-CCL-001 | CCL separates canonical, experimental, superseded, rejected, unverified, and quarantined knowledge. | canonical | `docs/ccl/ccl-integration.md`, `ccl/state.json` |
| OC-SAI-001 | SAI is the GPT-5.6 design-agent provenance for EpochCast. | canonical provenance statement | `docs/research/sai-epochcast-coherence-protocol.md` |
| OC-EPOCH-001 | EpochCast separates active authority delivery from spectator/history delivery. | experimental | standalone EpochCast specification |
| OC-EPOCH-002 | The authority processes commitments, not audiences. | canonical protocol thesis, unverified performance implication | standalone EpochCast specification |
| OC-EPOCH-003 | Initial active micro-epoch target is approximately 40 ms. | experimental | standalone EpochCast specification, `ccl/state.json` |
| OC-EPOCH-004 | Equal uses a Strong Path and explicit cut manifest. | experimental protocol / canonical need for a cut | standalone EpochCast specification, atomic Equal contract |
| OC-EPOCH-005 | Merkle roots commit manifests but do not prove execution correctness. | canonical limitation | standalone EpochCast specification |
| OC-EPOCH-006 | Spectator stream, offset recovery, lane handoff, and forks require benchmark proof. | experimental | standalone EpochCast specification, benchmark plan |
| OC-BENCH-001 | Direct fan-out, relay batching, stream spectators, and full EpochCast must be compared. | canonical evaluation rule | `docs/evaluation/benchmark-plan.md` |
| OC-BENCH-002 | Correctness violations invalidate a performance success. | canonical evaluation rule | benchmark plan |
| OC-RISK-001 | Regional fairness, cost, request collapse, scale, and novelty are unverified. | unverified | `docs/research/open-problems.md`, `ccl/state.json` |
| OC-PUB-001 | Public repository allows Open Calculator, SAI, EpochCast, CCL, and relevant public technology names. | canonical | `docs/safety/publication-policy.md` |
| OC-PUB-002 | Credentials, personal contact data, private infrastructure, local paths, private session identifiers, and unrelated projects are prohibited. | canonical | publication policy, scanner, tests |
| OC-PUB-003 | Scan read and enumeration errors fail closed; matched values are not printed. | canonical scanner contract | `scripts/public-safety.mjs`, `tests/public-safety.test.mjs` |

## External primary references

| Reference ID | Purpose |
|---|---|
| REF-CLOUDFLARE-DO-WS | Candidate Durable Object and Hibernating WebSocket behavior, including batching guidance. |
| REF-OPENAI-STRUCTURED-OUTPUTS | Schema-constrained model output design. |
| REF-OPENAI-CODEX-CLOUD | Public Codex coding-agent workflow reference. |

External references support platform-capability statements. They do not prove Open Calculator performance, fairness, correctness, or novelty.
