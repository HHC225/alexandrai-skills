# Writing methodology — the craft of a strong academic paper

How to actually *write* a publishable paper, distilled from authoritative guidance (Nature
Portfolio author resources + the Nature summary-paragraph template, Science/AAAS author
instructions, the PLOS "Ten Simple Rules" series, EQUATOR reporting guidelines, and university
writing centres). `authoring-guide.md` covers mapping your inputs into the template; **this** file
is the writing standard the paper must meet. Favour the checkable rules below.

## 1. Structure (IMRaD) + the hourglass
- Use **Introduction → Methods → Results → Discussion** (Abstract on top, Conclusion + References at the end). In this skill that is `paper.abstract` then numbered `sections[]`.
- One paper carries **one central message**. Every section, paragraph, figure serves it; if a sentence doesn't, cut it.
- **Hourglass shape:** broad → narrow → broad. Intro opens on the field and narrows to your question; Methods/Results stay narrow and specific; Discussion widens back to implications.
- Apply **Context → Content → Conclusion** fractally — to the whole paper, each section, and each paragraph.
- Polish in proportion to readership: **title > abstract > figures > body**. Most readers see only the first three.
- Drafting order ≠ reading order: write Methods/Results first, then Intro/Discussion, then Abstract and Title **last**.

## 2. Title
- ~**10–15 words**; specific. Name the key variables / system / population so a reader can tell what is distinctive.
- Front-load **1–2 keywords** (search/indexing). Avoid undefined abbreviations, jargon, and hype ("novel", "first-ever").
- Do: *"Sleep deprivation reduces hippocampal spatial-memory consolidation in adult mice"*. Don't: *"A study on the effects of sleep on memory"* (vague) or *"Sleep: the brain's hidden superpower?"* (hype, no content).

## 3. Abstract (`paper.abstract`)
- One self-contained paragraph: **context → gap → aim → methods → key result (with numbers) → conclusion/implication**. ~150–200 words.
- **No citations, footnotes, or undefined abbreviations.** Report the headline result **quantitatively** (effect size + direction), not "results are discussed".
- Nature summary-paragraph template (good default): 1–2 sentences broad intro → 2–3 sentences narrower background → 1 sentence stating the problem → **one "Here we show…" sentence with the main result** → 2–3 sentences vs. prior knowledge → 1–2 sentences wider context.
- Do: *"How X regulates Y is unknown. Here we show X directly represses Y, cutting Z by 40% (95% CI 31–49)."* Don't: *"In this paper we investigate X and present interesting findings."*

## 4. Introduction (first section)
- **Funnel:** field → what is known → the **gap** → your specific question/aim. State the gap explicitly ("…remains unknown / untested / contradictory").
- Give only enough background for a non-specialist to grasp significance — cite key prior work, not everything; it is not a literature review.
- End with a crisp **aim/contribution** statement (and, in many fields, a one-line preview of the main finding). A numbered contributions list is fine.
- Tense: present for established facts, past for what specific prior studies did.

## 5. Methods
- Reproducibility standard: enough detail that a **competent peer could replicate** the study from this section alone — err toward more detail.
- Include: design; participants/samples + **inclusion/exclusion** criteria; materials/instruments (with versions/identifiers); step-by-step procedure; full **statistics** (tests, software+version, thresholds, how effect sizes/CIs were computed); **ethics** (approval, consent) and **data/code availability**.
- **Cite** standard protocols rather than re-describing them; **fully describe** anything novel. Use **past tense** (passive is fine here).
- Follow the relevant **EQUATOR** reporting guideline for the study type (CONSORT = trials, PRISMA = systematic reviews, STROBE = observational) and its checklist.
- No results, no interpretation, no rationale (rationale lives in the Intro).

## 6. Results
- **Lead with the finding, then point to the evidence.** Report objectively — **no interpretation here** (that is the Discussion). Include non-significant / unexpected results too.
- Quantify with **effect size + uncertainty (95% CI)**, not bare p-values. E.g. *"A was lower than B (0.12 vs 0.22; ΔCI [0.08, 0.12]; d = 1.84; P < 0.001)."*
- **Figures and tables carry the evidence**; text highlights the trend, it does not re-list every number. Reference every display item, in order.
- Organise results in the order the Introduction set up the questions. Past tense.

## 7. Discussion
- **Interpret, don't restate.** Open by answering the research question and saying what the key results *mean*; bridge briefly from a result before interpreting it.
- **Relate to prior work** (agree / conflict / what's new). State **limitations honestly**, with their likely direction and plausible alternative explanations.
- Make the **"so what"** explicit (theory/practice/method/policy), **proportional** to the evidence.
- **Avoid overclaiming**: "suggests", "is consistent with", "may indicate" — never "proves"; no causal language from correlational data. No new results here.

## 8. Conclusion
- Strongest **take-home message in the first 1–2 sentences**; brief. Synthesise the contribution and its significance — closure, not a re-run of the Discussion.
- Add concrete **future work** (if not already covered). No new data or arguments.

## 9. Figures & tables (this skill's `figure` / `table` blocks)
- **Table** for precise/comparative numbers; **chart figure** for trends/patterns/relationships; **image figure** for prepared visuals. If it fits in 1–2 lines of text, don't make a display item.
- **One message per figure** — split if it needs two. **Self-explanatory captions** (define symbols, n, error bars, statistics). Always include **units** and correct precision.
- No **chartjunk** (no 3-D, gratuitous gridlines, decorative fills). **Accessibility:** don't rely on colour alone (≈8% of men are colour-blind) — the renderer's semantic palette + legend labels help; keep series distinguishable.
- Reference every figure/table in the body text, in order, and use the call-out to point at the trend.

## 10. Citations & literature (knowledge-graph edges)
- Cite **primary sources you actually read**; never cite via a secondhand reference.
- **Situate** your work — cite to establish the gap and to compare findings. Don't **pad** the reference list for volume.
- **Evaluate before citing**: judge each source's validity *and* relevance (relevance first). A citation is not proof of quality — **no blind trust in authority**. (See SKILL.md → Paper Workflow.)
- Attribute all borrowed words/ideas/figures (avoid plagiarism); cite your own prior work when reusing it (avoid self-plagiarism). Support every non-original factual claim.

## 11. Language & style
- **Clarity and concision first** — shortest unambiguous wording; one idea per sentence; cut filler.
- Prefer **active voice** ("We measured…", Nature's preference); passive is acceptable in Methods.
- **Tense:** present for established facts, past for your methods/results and for what specific prior studies did. Don't switch tense/voice mid-paragraph without reason.
- Define every abbreviation/symbol on first use; use **consistent terminology** (don't "elegantly vary" technical terms). Calibrate claims — avoid both hype and excessive hedging.

## 12. Top reasons papers are rejected (write to avoid these)
- **Out of scope** for the venue (commonest desk reject) → pick the right `primaryCategory`/topic.
- **No novelty/significance** — incremental "me-too" work with no new finding, method, or interpretation.
- **Flawed methodology / weak design or statistics** — the dominant peer-review rejection cause.
- **Overstated conclusions** beyond the data; p-values without effect sizes/CIs; underpowered.
- **Poor, disorganised writing.** **"Package" gaps** — missing reporting-guideline items, methods detail, data/ethics statements.

---

## Sources
- PLOS "Ten Simple Rules for Structuring Papers" — https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005619
- PLOS "Ten Simple Rules for Better Figures" — https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003833
- Nature Portfolio "How to write your paper" — https://www.nature.com/nature-portfolio/for-authors/write ; summary-paragraph template — https://www.nature.com/documents/nature-summary-paragraph.pdf
- Science/AAAS author instructions — https://www.science.org/content/page/instructions-authors-new-research-articles
- EQUATOR reporting guidelines — https://www.equator-network.org/reporting-guidelines/
- "Writing the title and abstract" (PMC6398294); effect sizes & CIs (PMC5133225); problem/gap/hook (PMC4602011); IMRaD (Temple, KTH); Discussion (USC); tenses (UNR).
