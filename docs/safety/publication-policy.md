# Public Publication Safety Policy

**Status:** canonical public boundary  
**Enforcement:** automated tracked-file scan, tests, CI, and manual review

---

## 1. Purpose

Open Calculator is a public technical showcase. Its architecture papers, X-RAY diagnostics, CCL records, benchmark reports, and model-assisted development evidence create many opportunities to publish information that does not belong in a public repository.

The policy allows the project and its public technical provenance to be discussed boldly while excluding dangerous or unrelated private material.

The scanner is fail-closed. An unreadable tracked text file is a publication failure, not an implicit pass.

---

## 2. Publicly allowed names and concepts

The repository may name and discuss:

- Open Calculator;
- SAI;
- SAI EpochCast Coherence Protocol;
- EpochCast;
- CCL and Causal Context Ledger;
- GPT-5.6;
- Codex;
- OpenAI;
- Cloudflare;
- Durable Objects;
- WebSockets;
- Rust;
- WebAssembly;
- SQLite;
- public standards, papers, documentation, and public open-source projects cited for technical relevance.

These allowances do not permit credentials, private account details, or private infrastructure associated with those names.

---

## 3. Prohibited public material

### 3.1 Credentials and secrets

- private keys;
- API keys;
- access tokens;
- refresh tokens;
- authorization headers containing credentials;
- session cookies;
- webhook secrets;
- database passwords;
- signing secrets;
- recovery codes;
- environment assignments containing real secret values;
- private connector or agent-session identifiers.

The scanner reports only rule identifier, file, and line. It must not print the matched value.

### 3.2 Personal information

- personal email addresses;
- telephone numbers;
- home or precise private addresses;
- legal names when not deliberately part of public project attribution;
- private account identifiers;
- personal schedules;
- device fingerprints;
- authentication subject identifiers.

Public pseudonymous game references are allowed only when generated for the product and not reversible to private identity through repository data.

### 3.3 Private infrastructure

- private or unpublished hostnames;
- private network addresses;
- public network addresses copied from real operations when not necessary;
- SSH usernames or commands tied to real hosts;
- cloud account identifiers;
- internal service URLs;
- private repository URLs;
- private topology diagrams;
- production database names;
- secret-bearing query strings;
- operational dashboards.

### 3.4 Local environment

- home-directory paths;
- user-specific browser profile paths;
- local workspace paths;
- temporary paths that expose a machine layout;
- editor or tool state containing private context;
- source maps containing local source roots.

### 3.5 Unrelated project information

User-owned or private project names, repositories, server labels, operational classifications, and implementation details unrelated to Open Calculator or CCL are excluded.

The public repository may explain that safety rules were adapted from prior internal practice, but it does not need to identify those unrelated projects.

### 3.6 Unsafe generated content

Model output, benchmark logs, screenshots, fixtures, and copied terminal output are subject to the same rules as hand-written files. “Generated” is not an exemption.

---

## 4. Documentation-safe examples

Documentation may need examples of paths, addresses, headers, or tokens. Examples must use reserved or obviously redacted forms.

Allowed classes include:

- `example.com`, `example.org`, and `example.net`;
- RFC documentation address blocks;
- placeholders such as `<redacted>`, `<token>`, `<private-host>`, and `<local-path>`;
- synthetically constructed strings that cannot be mistaken for a real credential.

Exemptions are match-level and path-specific. There is no whole-line or whole-file bypass merely because a file is documentation or a test.

---

## 5. Scanner contract

The public-safety scanner must:

1. scan every tracked text file selected by the repository policy;
2. support scanning an explicit file or directory for local testing;
3. use filesystem metadata to distinguish files from directories;
4. fail closed on read, stat, traversal, or tracked-file enumeration errors;
5. treat private denylist terms as literals rather than regular expressions;
6. avoid printing matched secret values;
7. report findings as `RULE_ID path:line`;
8. apply only narrow exact documentation exemptions;
9. scan scanner source and test source rather than excluding them wholesale;
10. return a non-zero status on any finding;
11. report the number of scanned files on success.

---

## 6. Rule classes

The initial scanner covers:

- private-key blocks;
- common high-confidence token prefixes;
- credential-bearing authorization headers;
- cookie headers containing values;
- non-example email addresses;
- IPv4 and IPv6 address literals outside exact documentation allowances;
- Unix and Windows absolute paths;
- user-profile paths;
- webhook URLs;
- source-map local paths;
- private denylist terms supplied outside the repository;
- Open Calculator-specific forbidden operational fields when introduced.

No pattern list is complete. Manual review remains required.

---

## 7. Private denylist

A publication operator may supply a private denylist file through a local environment variable or CI secret configuration.

Rules:

- the denylist file is never committed;
- terms are matched literally;
- empty and comment lines are ignored;
- finding output identifies the target file, never the denylist path or term;
- failure to read an explicitly requested denylist fails closed;
- public tests use synthetic terms only.

The denylist is a supplemental control for known private nouns, not a substitute for general secret scanning.

---

## 8. Manual review checklist

Before opening or updating a public pull request, review:

- changed filenames;
- full public diff;
- generated artifacts;
- screenshots and image metadata;
- logs and benchmark artifacts;
- documentation links;
- source maps;
- CCL quarantine metadata;
- model prompts and outputs;
- environment examples;
- repository history for accidental earlier publication.

The reviewer asks not only “is this a secret?” but also “does this information belong to Open Calculator’s public technical story?”

---

## 9. CCL handling

CCL may record that a safety finding occurred, but the public record contains sanitized metadata only.

Safe example:

```yaml
finding_id: SAFE-001
rule_id: PRIVATE_KEY_BLOCK
raw_value_stored: false
status: blocked
resolution: source artifact excluded
```

Unsafe behavior would be copying the matched value into `ccl/quarantine/`.

---

## 10. X-RAY handling

X-RAY mode must display public-safe identifiers and aggregate metrics.

Allowed:

- pseudonymous actor reference;
- epoch, sequence, round, and offset;
- state and payload hashes;
- region class rather than exact private location;
- latency and queue metrics;
- schema and evaluator versions;
- sanitized error codes.

Not allowed:

- raw network address;
- authorization subject;
- cookie or token;
- private hostname;
- stack trace with local path;
- cloud account identifier;
- full provider request or response containing credentials.

---

## 11. GPT and Codex evidence

Public model-assistance evidence may include:

- model family or public model identifier;
- prompt-template version;
- structured schema;
- evidence hash;
- output hash;
- accepted public output;
- validation status;
- human-versus-agent contribution class.

It excludes:

- private session identifier;
- hidden system or connector metadata;
- credentials;
- unrelated conversation content;
- personal context;
- private repository access details.

---

## 12. Failure response

When the scanner or reviewer finds a risk:

1. block publication;
2. do not print or repeat the dangerous value;
3. remove or replace the unsafe source;
4. review history and generated artifacts;
5. rotate or revoke a real credential when exposure is possible;
6. add or refine a test without embedding the original secret;
7. record sanitized CCL metadata when useful;
8. rerun the full tracked scan.

A finding is not resolved merely by deleting the visible line when it may remain in history or generated output.

---

## 13. Publication gate

A public documentation pull request is eligible for review only when:

- tracked scan passes;
- scanner tests pass;
- no secret or dangerous personal information is present;
- no unrelated private project name is present;
- all external links are deliberately public;
- measured and simulated values are labeled correctly;
- CCL status labels match the documents;
- the branch remains unmerged until review is complete.

---

## 14. Truthfulness as safety

Unsupported technical certainty is also a publication risk. The repository must not present:

- target scale as measured scale;
- experimental architecture as deployed architecture;
- a model proposal as a verified invention;
- a root hash as proof of correct execution;
- a passing focused test as proof that an unrelated failure does not matter;
- an earlier-head result as evidence for the current head.

The same fail-closed spirit applies to factual confidence: when evidence is missing, status remains `unverified`.
