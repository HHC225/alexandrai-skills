import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const skillPath = new URL('../skills/alexandrai-research-publishing/SKILL.md', import.meta.url);
const researchPaperSpecPath = new URL(
  '../skills/alexandrai-research-publishing/assets/report-formats/specs/research-paper.md',
  import.meta.url
);

async function readSkill() {
  return readFile(skillPath, 'utf8');
}

async function readResearchPaperSpec() {
  return readFile(researchPaperSpecPath, 'utf8');
}

function sliceBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, `missing start marker: ${start}`);
  const endIndex = text.indexOf(end, startIndex);
  assert.notEqual(endIndex, -1, `missing end marker: ${end}`);
  return text.slice(startIndex, endIndex);
}

test('autonomous framing requires local resource analysis before external research', async () => {
  const skill = await readSkill();
  const frameSection = sliceBetween(
    skill,
    '### 0. Frame the autonomous study',
    'AlexandrAI is a knowledge graph as well as a paper site.'
  );

  assert.match(frameSection, /Local Resource Survey/);
  assert.match(frameSection, /before the first external search/i);
  assert.match(
    frameSection,
    /Do not infer category ids from filenames,\s+folder\s+names,\s+examples,\s+or prior memory/i
  );

  for (const requiredLocalFile of [
    'assets/categories.json',
    'assets/languages.json',
    'assets/report-formats/schemas/research-paper.schema.json',
    'assets/chart-examples.json',
    'assets/report-formats/specs/research-paper.md',
    'assets/report-formats/registry.json',
    'assets/report-formats/REPORT_POLICY.md'
  ]) {
    assert.ok(
      frameSection.includes(requiredLocalFile),
      `local resource survey should require reading ${requiredLocalFile}`
    );
  }
});

test('autonomous framing requires surveying the user workspace projects', async () => {
  const skill = await readSkill();
  const frameSection = sliceBetween(
    skill,
    '### 0. Frame the autonomous study',
    'AlexandrAI is a knowledge graph as well as a paper site.'
  );

  assert.match(frameSection, /User Workspace Survey/);
  assert.match(frameSection, /current working\s+directory/i);
  assert.match(frameSection, /local project/i);
  assert.match(frameSection, /git status/i);
  assert.match(frameSection, /README|package\.json|pyproject\.toml|Cargo\.toml|go\.mod/);
  assert.match(frameSection, /\.env|secrets|credentials|node_modules|dist|build|\.git/);
  assert.match(frameSection, /must not become category ids/i);
});

test('paper workflow requires an original contribution beyond stitched survey', async () => {
  const skill = await readSkill();

  assert.match(skill, /Original Contribution Gate/);
  assert.match(skill, /Do not draft/i);
  assert.match(skill, /summarize,\s+paraphrase,\s+or stitch/i);
  assert.match(skill, /LLM(?:'s)?\s+(?:prior\s+)?knowledge/i);
  assert.match(skill, /not factual evidence/i);
  assert.match(skill, /conceptual model|taxonomy|method|reproducible analysis|research agenda/);
  assert.match(skill, /contributionClaim/);
  assert.match(skill, /claimLedger/);
});

test('writing methodology requires original synthesis instead of source stitching', async () => {
  const methodology = await readResearchPaperSpec();

  assert.match(methodology, /Evidence ledger and claim discipline/);
  assert.match(methodology, /contributionClaim/);
  assert.match(methodology, /model|taxonomy|method|reproducible analysis|research agenda/);
  assert.match(methodology, /summarize,\s+paraphrase,\s+or stitch/i);
  assert.match(methodology, /LLM(?:'s)?\s+(?:prior\s+)?knowledge/i);
  assert.match(methodology, /not factual evidence/i);
  assert.match(methodology, /noveltyBoundary/);
});

test('paper workflow requires English-only search terms and paper keywords', async () => {
  const skill = await readSkill();
  const searchSection = sliceBetween(
    skill,
    'AlexandrAI is a knowledge graph as well as a paper site.',
    '## Authoring The Paper'
  );
  const authoringSection = sliceBetween(
    skill,
    '## Authoring The Paper',
    '## Validate And Publish'
  );

  assert.match(searchSection, /English-only/i);
  assert.match(searchSection, /search/i);
  assert.match(authoringSection, /English-only/i);
  assert.match(authoringSection, /paper\.keywords/);
});

test('paper workflow deepens short drafts through research instead of padding or extra charts', async () => {
  const skill = await readSkill();
  const authoringSection = sliceBetween(
    skill,
    '## Authoring The Paper',
    '## Validate And Publish'
  );

  assert.match(authoringSection, /short draft|draft is short|paper is short/i);
  assert.match(authoringSection, /return to research/i);
  assert.match(authoringSection, /Do not pad prose/i);
  assert.match(authoringSection, /source synthesis/i);
  assert.match(authoringSection, /local evidence triage/i);
  assert.match(authoringSection, /contradictions|contradictory evidence/i);
  assert.match(authoringSection, /limitations/i);
  assert.match(authoringSection, /contributionClaim|original contribution/i);
  assert.match(authoringSection, /extra charts|additional charts|decorative charts/i);
});

test('publishing workflow requires choosing a report format and theme before drafting', async () => {
  const skill = await readSkill();

  assert.match(skill, /Format Selection Gate/);
  assert.match(skill, /assets\/report-formats\/registry\.json/);
  assert.match(skill, /assets\/report-formats\/REPORT_POLICY\.md/);
  assert.match(skill, /theme/i);
  assert.match(skill, /dashboard|one-pager|runbook-checklist|long-form-report/);
  assert.match(skill, /Do not default to research-paper/i);
});

test('non-paper formats use separated AlexandrAI metadata instead of top-level aipaper in report data', async () => {
  const skill = await readSkill();

  assert.match(skill, /alexandrai-metadata/);
  assert.match(skill, /#report-data/);
  assert.match(skill, /additionalProperties:\s*false|additionalProperties/);
  assert.match(skill, /request format/i);
  assert.match(skill, /must match/i);
});

test('research-paper deep research gate is scoped to the research-paper format', async () => {
  const skill = await readSkill();

  const researchGate = sliceBetween(skill, '### Research-Paper Gate', '### Graph Research');
  assert.match(researchGate, /only/i);
  assert.match(researchGate, /research-paper/i);
  assert.match(researchGate, /researchAudit/);
});
