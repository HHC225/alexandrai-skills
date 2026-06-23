# Icon system — design spec (SPEC.md)

> The house icon set for reports built on **[`../DESIGN.md`](../DESIGN.md)**. One coherent family,
> drawn to a strict grid so 250+ icons authored by different hands still read as a single set.
> These are **bespoke, domain-forward icons** — banking / audit / incident / engineering — NOT the
> generic "AI assistant" icon vocabulary. Read this whole file before drawing a single path.

## Why this set exists

Reports in this system are forwarded to client reviewers, executives, and regulators. They must read as
a **signed-off institutional publication**, never as a SaaS dashboard or an AI-generated artefact. The
icon family is therefore: precise, geometric, restrained, monochrome, and **themeable** (it inherits the
active brand colour via `currentColor`). Every icon is a small piece of typography, not decoration.

## The 12 hard rules (non-negotiable)

1. **Canvas.** `viewBox="0 0 24 24"`. No `width`/`height` attributes on the file (the consumer sizes it).
2. **Live area.** All geometry sits inside a **2px margin** → the drawable box is `2 … 22` on both axes.
   The optical mass should fill ~20px; do not draw a tiny 12px glyph floating in the middle.
3. **Stroke.** `stroke="currentColor"`, `stroke-width="1.75"`, `fill="none"` set **once on the `<svg>`**.
   Children inherit — do not repeat stroke attrs per element unless overriding (see rule 5).
4. **Joins / caps.** `stroke-linecap="round"`, `stroke-linejoin="round"` on the `<svg>`. Always rounded.
5. **Colour.** Single colour only — `currentColor`. **No** second colour, **no** gradient, **no** opacity
   tricks, **no** drop-shadow, **no** `fill` except the signature node (rule 6) and genuinely solid marks.
6. **Signature node.** Endpoints / data-points / nodes are **small rounded squares** (`rx≈1.2`, side
   3–4px) `fill="currentColor" stroke="none"` — NOT circles. This squared-node detail is the family's
   fingerprint (it echoes the report's rounded-rectangle panels). Use circles only when the subject is
   genuinely circular (a clock face, a coin, a pie).
7. **Geometry.** Forms are upright, orthogonal, and constructed on the grid. Rectangles use `rx="2"`.
   Rounded where things terminate; rectilinear where things are structural. Banking-grade precision,
   not hand-drawn looseness.
8. **Weight consistency.** Every icon must look the same visual weight beside its siblings at 16px and
   20px. No icon should be markedly denser or lighter than the set.
9. **One concept per icon.** An icon names one thing. Do not cram a badge + a magnifier + an arrow into
   one glyph; compose multiple icons in markup instead.
10. **No text.** Never bake letters/numbers into an icon (the report uses mono letter-chips for that).
11. **Markup shape.** Exactly the header in rule 12 — attribute order fixed — then paths, then `</svg>`.
    Keep it minified-ish: one element per line, no comments inside the file (metadata lives in the
    manifest). Round all coordinates to ≤ 2 decimals.
12. **Canonical header** (copy verbatim):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  …paths…
</svg>
```

## BAN LIST — the "generic AI icon" vocabulary (never draw these)

These are the tells of an auto-generated icon set. They are **forbidden** in this family:

- ✦ **AI sparkle / 4-point twinkle star**, "magic" wand, glitter — the single biggest tell. Never.
- 💡 generic **lightbulb "idea"**, 🚀 **rocket "launch / growth"**, 🧠 **brain**, 🤖 **robot / android head**.
- 👍👎 thumbs, 😀 smiley / emoji faces, ❤️ heart, 🔥 flame "hot", 🎉 party popper, 🏆 trophy.
- 💬 **speech bubble with "…" dots**, 👋 waving / 👆 pointing hand, 🧩 puzzle-piece "integration".
- ⚙️ **gear as a catch-all "settings"** mark (a gear is allowed ONLY for literal configuration/build).
- ☁️ **cloud-with-up-arrow** generic upload, 🌐 generic globe-for-"web", hamburger lines used as a logo.
- Any glyph whose meaning is "AI did something clever here." We are a bank-grade report, not a chatbot.

When a generic concept tempts you (e.g. "idea", "insight", "smart"), pick the **domain-specific** form
instead: an *insight* is a magnifier over a data-bar; a *recommendation* is a checked document; a
*highlight* is a marked line. Concrete beats cute, every time.

## How icons are consumed (so you draw for the real use)

Icons are **inlined** into self-contained report HTML (reports carry no external icon requests). The
consumer pastes the `<svg>` and sizes/colours it with one class:

```html
<span class="icon"><!-- paste document-report.svg here --></span>
<!-- or directly: --> <svg class="icon icon-sm"> … </svg>
```
```css
.icon    { width: 1.15em; height: 1.15em; display: inline-block; vertical-align: -0.18em; color: inherit; }
.icon-sm { width: 14px; height: 14px; }  .icon-lg { width: 20px; height: 20px; }
/* colour follows currentColor → set color on the icon or its parent; themes flow automatically */
```

Because colour is `currentColor`, an icon dropped into a `risk`-coloured chip turns bordeaux; one in a
brand chip turns the active brand hue. **This only works if you obey rule 5 (single currentColor).**

## Directory & file conventions

```
icons/
  SPEC.md            ← this file (the source of truth)
  README.md          ← human usage guide
  _exemplars/        ← the 9 style-anchor icons (study these; match them exactly)
  <category>/        ← one folder per category (see master list)
    <name>.svg       ← kebab-case, one icon per file
    manifest.json    ← this category's index (array of {name,file,category,keywords})
  manifest.json      ← aggregated index (built after all categories land)
  index.html         ← themed gallery / catalog (built last)
```

- **File name** = the icon name, kebab-case, `.svg`. e.g. `document-report.svg`, `chevron-right.svg`.
- Each category folder ships a `manifest.json`: `[{ "name":"document-report", "file":"document-report.svg",
  "category":"document", "keywords":["report","page","doc","analysis"] }, …]`. Keywords drive catalog search.

## Master catalogue (14 categories — the names to draw)

Draw the names below for your assigned category; you MAY add a few obviously-missing siblings that fit
the set, but cover the listed names first. ~18–26 icons per category. Keep every one distinct.

- **document** — document, document-report, document-check, document-search, document-lock, page, pages-stack, file-text, file-code, file-data, clipboard, clipboard-check, clipboard-list, folder, folder-open, archive-box, table-of-contents, attachment, signature-doc, summary-lines, paragraph, copy, doc-compare
- **status** — check, check-circle, cross, cross-circle, warning-triangle, warning-octagon, info-circle, question-circle, clock-pending, progress-half, blocked, flag, flag-filled, shield-check, shield-alert, verified, dot-ok, dot-risk, dot-hold, hourglass, ban, stamp-approved, stamp-rejected
- **bug-qa** — bug, bug-resolved, defect, incident-alert, root-cause, wrench-fix, hotfix, flask-test, test-tube, test-checklist, regression, monkey-test, severity-high, severity-mid, severity-low, crash, stack-trace, breakpoint, assertion, coverage, retry, escalate, bell-alert, siren
- **finance** — bank, account, wallet, deposit, withdrawal, transfer, transfer-arrows, ledger, balance-scale, coin-yen, coins-stack, banknote, card-credit, vault, transaction, transaction-list, limit-gauge, percent-interest, exchange, receipt, invoice, atm, savings
- **code** — code, code-diff, code-merge, branch, commit, pull-request, terminal, function, variable, database, database-search, table-schema, api, endpoint, microservice, kafka-event, queue-message, repository, file-diff, build, deploy, rollback, version-tag
- **nav** — chevron-right, chevron-left, chevron-up, chevron-down, chevron-double-right, arrow-right, arrow-left, arrow-up, arrow-down, arrow-up-right, external-link, anchor-link, expand, collapse, expand-all, fullscreen, search, filter, sort-asc, sort-desc, menu, close, plus, minus, more-horizontal, back-to-top
- **data** — bar-chart, bar-chart-grouped, line-chart, trend-up, trend-down, area-chart, pie-chart, donut-chart, gauge, kpi-tile, scatter-plot, funnel, heatmap, sparkline, histogram, table-grid, pivot, metric-up, metric-down, delta, target, distribution, percent-ring
- **process** — timeline, milestone, phase, flow-arrow, gate, gate-check, checklist, cycle, loop, handoff, escalation, swimlane, decision-diamond, node-start, node-end, step-sequence, dependency, blocker-link, roadmap, sprint, kanban-flow, fork-path, merge-path
- **people** — user, user-check, users-team, role, reviewer, on-call, stakeholder, assignee, owner, group, org-chart, handoff-people, id-badge, persona, mention, contact, approver, escalation-contact
- **time** — clock, clock-alert, calendar, calendar-event, calendar-check, duration, deadline, history, schedule, stopwatch, timer, recurring, sla-clock, elapsed, timezone
- **security** — lock, lock-open, key, shield, shield-keyhole, audit-magnifier, policy-doc, certificate, signature-pen, redact, fingerprint, access-grant, access-deny, encryption, token, mfa, vulnerability, patch, compliance-check
- **infra** — server, server-stack, cloud, container, node-network, network-nodes, queue, cache, load-balancer, cpu, memory-ram, disk-storage, gateway, firewall, dns, region-zone, scale-up, instance, cluster, monitor
- **source** — source-ticket, source-repo, source-monitoring, source-logs, source-datamodel, source-wiki, source-chat, source-console, source-design-doc, source-spec, source-regulator, source-press, source-rca, source-news, source-email, source-external
- **editorial** — quote, bookmark, pin, tag, label, highlight, note, callout, asterisk, key-point, insight, recommendation, warning-note, info-note, list-bullet, list-numbered, divider, section-mark, footnote, exhibit-mark

## The 9 style-anchor exemplars

`_exemplars/` holds nine finished icons spanning the set. **Open them, match their construction.** They
demonstrate: pure-stroke nav (`chevron-right`), circle+mark status (`check-circle`), the document family
(`document-report`), a domain creature (`bug`), domain architecture (`bank`), engineering (`code`), data
(`bar-chart`), security (`shield-check`), and the **signature squared-node** rule (`node-network`).

If your icon doesn't sit comfortably beside those nine at 16px, it's wrong — redraw it.
