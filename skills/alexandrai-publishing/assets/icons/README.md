# Icon library

A bespoke, **domain-forward** SVG icon set for the Dense Institutional Report System — banking /
audit / incident / engineering. One coherent family, drawn to a strict 24-grid so 300+ icons read
as a single set. **Not** the generic "AI-assistant" icon vocabulary, and **never** emoji.

- **678 icons** across **26 categories** · monoline · `currentColor` (auto-themes) · `viewBox 0 0 24 24`.
- The design law is **[`SPEC.md`](SPEC.md)** — the 12 hard rules + the BAN LIST. Read it before adding icons.
- Style anchors live in [`_exemplars/`](_exemplars/) (9 finished icons spanning the set).

| | | | |
|---|---|---|---|
| annotation **22** | arrows **24** | bug-qa **24** | code **46** |
| commerce **20** | communication **22** | data **43** | device **24** |
| document **23** | editorial **20** | finance **43** | infra **23** |
| legal-governance **16** | logistics **17** | maps-location **18** | math-units **23** |
| media **23** | nav **26** | people **21** | process **44** |
| security **39** | source **16** | status **43** | sustainability **16** |
| time **17** | ui-controls **25** | | |

## Browse & search

- **[`index.html`](index.html)** — a themed, searchable gallery. Open it in a browser (works straight
  off the filesystem — every icon is inlined). Type a name / keyword to filter; click any icon to copy
  its `<svg>`; switch the brand theme to see `currentColor` theming live.
- **[`manifest.json`](manifest.json)** — a flat index `[{name, file, category, keywords}]` for tooling /
  lookup.

## Use an icon in a report

Reports are self-contained, so **inline the SVG** and size it with one class:

```html
<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9.5 5.5 16 12l-6.5 6.5"/></svg></span>   <!-- e.g. nav/chevron-right -->
```
```css
.icon    { width: 1.15em; height: 1.15em; display: inline-block; vertical-align: -.18em; color: inherit; }
.icon-sm { width: 14px; height: 14px; }   .icon-lg { width: 20px; height: 20px; }
```

- **Colour is `currentColor`** — set `color` on the icon or its parent and the icon follows. Drop one
  into a `risk` chip and it turns bordeaux; into a brand chip and it turns the active brand hue. No
  per-icon recolouring, no fills to override.
- **Sizing** is the consumer's job (the files carry no `width`/`height`). Use `em` so the icon tracks
  the surrounding text, or a fixed `.icon-sm`/`.icon-lg`.
- **Pair `source/*` icons** with the `source-ref-pill` colour family in reference lists.

## Conventions

```
icons/
  SPEC.md            design law (rules + BAN LIST)        index.html     gallery (generated)
  README.md          this file                            manifest.json  flat index (generated)
  _exemplars/        9 style anchors                      build_catalog.py  regenerates the two above
  <category>/<name>.svg   one icon per file (kebab-case)
  <category>/manifest.json  per-category index (name, file, category, keywords)
```

- **Signature detail:** data-nodes / endpoints are small **rounded squares** (`rx≈1.2`,
  `fill="currentColor" stroke="none"`), never circles — the family fingerprint. Circles appear only on
  genuinely round subjects (clock face, coin, pie, gauge).
- **Banned:** emoji, and generic "AI" icons (sparkle/twinkle, lightbulb-idea, rocket, robot, brain,
  gear-as-settings, speech-bubble-dots, cloud-with-up-arrow). See `SPEC.md` § BAN LIST.

## Add or edit icons

1. Draw to **`SPEC.md`** (canonical header, 2px live-area margin, single `currentColor`, signature
   nodes). Save as `icons/<category>/<name>.svg`; add an entry to that category's `manifest.json`
   (or a `manifest.extra.json` when topping up an existing category — `build_catalog.py` reads every
   `manifest*.json`, and falls back to name-derived keywords for any icon a manifest misses).
2. Rebuild the catalog + validate every file against the SPEC header rules:

   ```bash
   python3 icons/build_catalog.py      # or: uv run icons/build_catalog.py
   ```

   It regenerates `manifest.json` + `index.html` and prints per-category counts and any rule
   violations (0 warnings = clean).
