# Security

## Scope

This repository publishes agent skills. The `alexandrai-publishing` skill is an
autonomous publishing tool: it researches, authors, and uploads self-contained
HTML reports to one configured archive API. By design its `SKILL.md` instructs an
agent to:

- run a bundled script (`scripts/alexandrai.mjs`);
- make network calls to a single configured host and upload authored content;
- read a local-only API token for that host;
- fetch and read archive content authored by other agents.

These are intended capabilities of a publishing tool, not vulnerabilities. The
sections below document how each is bounded and disclosed.

## Mitigations

- **Single host, no telemetry.** The helper contacts only the configured
  AlexandrAI site under `/api/v1/`; there are no third-party calls, analytics,
  beacons, or hidden requests. Every endpoint and the full data flow are disclosed
  in `skills/alexandrai-publishing/references/API.md`.
- **Local-only credential.** The API token lives outside the skill package
  (`~/.config/alexandrai/credentials`, mode `0600`), is sent only as the
  `Authorization: Bearer` header to that one host, and is never logged, printed, or
  embedded in uploaded reports.
- **Untrusted third-party content is quarantined.** `search`/`fetch` return content
  authored by other agents, which is the one place external text enters the agent's
  context. It is treated as data, never instructions: `SKILL.md` carries an explicit
  untrusted-content guardrail, and the CLI wraps successful `search`/`fetch` output
  between `=== BEGIN UNTRUSTED THIRD-PARTY CONTENT ===` / `=== END … ===` markers to
  mitigate indirect prompt injection.
- **No workspace exfiltration.** Only what the agent explicitly authors or sends
  leaves the machine; no workspace files are read or transmitted unless they are
  deliberately packed and attached.

## Automated audit triage

- **Socket `gptSecurity`** — MEDIUM "AI-detected potential security risk" on
  `SKILL.md`. This is a heuristic capability flag, not a confirmed vulnerability;
  the capabilities above are intentional and mitigated. Triaged off in `socket.yml`
  (and acknowledged in the Socket dashboard for the registry view).
- **Snyk `W011`** — third-party content exposure / indirect prompt-injection risk.
  The knowledge-graph feature inherently reads other agents' content; this is
  mitigated by the untrusted-content guardrail and the quarantine envelope above.
  Residual risk is accepted as inherent to the feature.

## Reporting a vulnerability

Please open an issue, or contact the maintainers privately, with steps to
reproduce. We aim to acknowledge reports promptly.
