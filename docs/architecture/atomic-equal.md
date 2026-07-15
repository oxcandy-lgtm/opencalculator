# Atomic Equal Contract

**Status:** canonical semantic contract; implementation pending or evolving  
**Scope:** Open Calculator `=` settlement

---

## 1. Purpose

The Equal key is not a normal calculator command. It is a value-creating settlement operation. A successful Equal attempt can:

- select the final expression for a round;
- debit `seg`;
- evaluate a result;
- create a persistent card;
- allocate a Unique catalog edition;
- assign ownership;
- publish an event and replay boundary;
- reset the shared expression.

These effects must either happen together or not happen at all.

---

## 2. Required invariants

For every round:

1. At most one successful Equal transaction exists.
2. A successful transaction charges exactly once.
3. One idempotency key cannot mint or charge twice.
4. A stale Equal attempt does not charge.
5. An invalid expression does not mint.
6. A failed evaluation does not mint.
7. A failed balance check does not mint.
8. One Unique edition is not allocated twice.
9. A successful mint and round reset are atomic.
10. Replay from the committed pre-state and event range reproduces the result and post-state hash.
11. Outbox publication is recoverable without creating conflicting duplicate events.
12. Public evidence does not expose credentials or private identity data.

---

## 3. Equal intent

```text
EqualIntent {
  protocol_version
  command_id
  actor_ref
  observed_round_id
  observed_state_hash
  idempotency_key
  maximum_equal_margin?
  gateway_epoch_hint?
  client_sent_at?
}
```

`client_sent_at` is diagnostic only. Client clocks do not decide authority.

---

## 4. Transaction inputs

The transaction reads:

- current room and round state;
- committed expression and evaluator version;
- actor balance;
- idempotency record;
- current Equal Margin policy;
- Unique registry and edition counters;
- event sequence allocator;
- current epoch and state commitments;
- marketplace or inventory constraints when relevant.

All inputs that influence the result must be versioned or committed.

---

## 5. Decision order

A reference decision order is:

```text
1. Parse and authenticate request envelope.
2. Resolve actor_ref without exposing private identity.
3. Validate protocol and command schema.
4. Look up idempotency key.
5. Return the prior result if this exact request already committed.
6. Reject conflicting reuse of an idempotency key.
7. Establish the Equal cut and authoritative command order.
8. Compare observed round with current round.
9. Reject stale round without charge.
10. Compare observed state hash according to tolerance policy.
11. Calculate deterministic Equal Margin.
12. Enforce maximum_equal_margin when supplied.
13. Verify sufficient balance.
14. Validate and evaluate the expression safely.
15. Derive deterministic score and rarity evidence.
16. Match the Unique registry, if applicable.
17. Allocate the next edition within the transaction.
18. Allocate card and event identifiers.
19. Debit seg.
20. Mint the card and assign ownership.
21. Append the Equal event and Proof-of-Birth seed.
22. Write the transactional outbox record.
23. Reset the room into the next round.
24. Compute and store the post-state hash.
25. Commit.
26. Return the committed receipt.
```

Steps that occur before the database transaction may validate syntax and establish a cut, but no economic success is visible before the atomic commit.

---

## 6. Stale behavior

A request is stale when the round it observed is no longer current or when the authoritative Equal cut places a prior successful Equal before it.

A stale response includes only safe public information:

```text
EqualRejected {
  command_id
  status: "stale"
  charged: false
  observed_round_id
  current_round_id
  current_state_hash
  recovery_hint
}
```

The stale request must not reserve, debit, or later refund currency. “Charge then refund” creates avoidable failure modes and poor user trust.

---

## 7. Idempotency

The service stores a bounded idempotency record:

```text
IdempotencyRecord {
  actor_ref
  idempotency_key_hash
  request_fingerprint
  status
  committed_receipt_ref?
  created_at
  expires_at_or_retention_class
}
```

Rules:

- exact retry of a committed request returns the same receipt;
- exact retry of an in-progress request returns pending or waits within a bound;
- reuse with different request content is rejected;
- the raw key is not written to public logs;
- retention must exceed normal client retry windows and delayed network delivery.

---

## 8. Equal Margin

Equal Margin is calculated from committed deterministic inputs. The receipt records:

```text
EqualMarginEvidence {
  policy_version
  base
  magnitude_component
  structure_component
  operation_risk_component
  congestion_component
  total
}
```

A player may provide `maximum_equal_margin`. If the current total exceeds that value, the attempt is rejected without charge and without minting.

The fee cannot be delegated to GPT-5.6.

---

## 9. Expression evaluation

The transaction uses a safe evaluator with a versioned grammar and bounds.

Evaluation produces:

```text
EvaluationResult {
  evaluator_version
  status
  canonical_result?
  display_result?
  exactness
  deterministic_feature_seed?
  error_code?
  evaluation_commitment
}
```

Error text is sanitized. Internal stack traces, paths, hosts, and provider details are not returned to public clients.

---

## 10. Unique edition allocation

Unique registry matching is deterministic. If the result matches a registry entry, edition allocation occurs inside the same transaction as ownership.

A candidate table uses a unique constraint on:

```text
(unique_catalog_id, edition_number)
```

The next edition is allocated through a transaction-safe counter or database-returned increment. Reading a count and writing `count + 1` outside a protected transaction is prohibited.

---

## 11. Card mint

The card record includes stable commitments to:

- round;
- expression;
- evaluator version;
- result;
- deterministic features;
- Equal Margin;
- minter;
- registry and edition;
- event range;
- state hashes;
- epoch roots when EpochCast is enabled;
- canonization status.

GPT canonization may occur after mint. A delayed model call cannot block ownership or rewrite deterministic card facts.

---

## 12. Round reset

The reset occurs in the same transaction as minting.

```text
RoundReset {
  previous_round_id
  next_round_id
  new_expression
  new_state_hash
  reason: "successful_equal"
}
```

The next round identifier must be unique and monotonically related according to the room schema. Commands excluded by the Equal cut are assigned or rejected according to the versioned cut policy; they are not silently lost.

---

## 13. Transactional outbox

The transaction writes an outbox record rather than assuming an external stream append is atomic with local state.

```text
OutboxRecord {
  record_id
  aggregate_id
  event_sequence
  payload_hash
  payload
  publication_status
  producer_generation
}
```

Publication is at least once. Consumers deduplicate by `record_id` and verify content identity.

A crash after commit but before publish leaves an undelivered outbox record. A crash after publish but before acknowledgment may cause an identical retry. Neither case may create a second card or charge.

---

## 14. Receipt

A successful public receipt may contain:

```text
EqualCommitted {
  command_id
  status: "committed"
  charged: true
  equal_margin
  card_id
  result_display
  rarity
  unique_catalog_id?
  unique_edition?
  previous_round_id
  next_round_id
  event_sequence
  post_state_hash
  replay_ref
  canonization_status
}
```

The receipt is safe to retry and safe to display. It contains no credential, private host, local path, or personal contact information.

---

## 15. Failure matrix

| Failure | Required outcome |
|---|---|
| malformed request | reject, no charge, no mint |
| repeated exact idempotency key | return prior receipt or pending state |
| conflicting key reuse | reject, no new charge |
| stale round | reject, no charge |
| state observation mismatch | reject or resync under explicit policy |
| fee above player maximum | reject, no charge |
| insufficient balance | reject, no charge |
| invalid expression | reject, no charge, no mint |
| evaluator timeout | reject, no charge, no mint |
| edition contention | serialize or retry transaction internally; never duplicate |
| database conflict | no partial visible success |
| crash before commit | no success exists |
| crash after commit | receipt recoverable; outbox eventually published |
| duplicate outbox delivery | identical content deduplicated |
| GPT failure | card remains valid; canonization failed or pending |

---

## 16. Simultaneous Equal test

A minimum race test creates many valid Equal intents for the same round and state.

Expected result:

```text
successful_mints = 1
successful_debits = 1
unique_edition_allocations <= 1 for the result
stale_rejections = attempts - 1
stale_charges = 0
next_round_count = 1
replay_hash_match = true
```

The test is repeated across process concurrency, network retry, database retry, gateway duplication, and sequencer restart scenarios.

---

## 17. Property-test model

Generate sequences containing:

- digits and operators;
- valid and invalid expressions;
- repeated idempotency keys;
- reordered delivery;
- dropped responses and retries;
- simultaneous Equal;
- balance near the fee boundary;
- registry matches;
- large result representations;
- reset timers;
- outbox failure.

Properties are checked after every generated run, not only at the final state.

---

## 18. EpochCast relationship

When SAI EpochCast is enabled, Equal also produces an Equal Cut Manifest linking:

- the final included epoch and command range;
- excluded commands;
- winning and stale Equal identifiers;
- pre- and post-state hashes;
- resulting round transition.

EpochCast changes communication and ordering evidence. It does not weaken the atomic database contract.

---

## 19. Promotion gate

The Equal implementation becomes canonical only when:

- focused unit tests pass;
- generated property tests pass;
- simultaneous races pass repeatedly;
- database conflict tests show no duplicate edition;
- crash injection validates outbox recovery;
- replay reaches the post-state hash;
- public-safety checks pass;
- evidence is tied to the exact commit under review.

A beautiful demo without these properties remains a prototype.
