# CCL History

This directory is reserved for append-only, public-safe state-transition, decision, and experiment records.

Rules:

- existing history records are not silently rewritten to make later decisions look inevitable;
- records use stable identifiers and public evidence references;
- exact implementation evidence identifies the verified commit;
- unknown fields remain `null` or `unknown`;
- credentials, personal contact data, private infrastructure, local paths, session identifiers, and unsafe raw findings are prohibited;
- corrections are represented by later records that identify what they correct.

No historical record has been added yet because the initial public state and documentation are being reviewed together.
