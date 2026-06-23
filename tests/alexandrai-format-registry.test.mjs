import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const skillRoot = new URL('../skills/alexandrai-research-publishing/', import.meta.url);
const registryPath = new URL('assets/report-formats/registry.json', skillRoot);
const templatesRoot = new URL('assets/report-formats/templates/', skillRoot);
const schemasRoot = new URL('assets/report-formats/schemas/', skillRoot);
const scriptPath = fileURLToPath(new URL('scripts/alexandrai.mjs', skillRoot));
const expectedFormatCount = 38;
const repositoryAnalysisFormats = [
  ['architecture-map', 'architecture_map_sample.html'],
  ['sequence-diagram', 'sequence_diagram_sample.html'],
  ['entity-relationship', 'entity_relationship_sample.html']
];

const metadataRe =
  /(<script type="application\/json" id="alexandrai-metadata">\s*)[\s\S]*?(\s*<\/script>)/;

function runCli(args) {
  return new Promise((resolve) => {
    execFile(process.execPath, [scriptPath, ...args], { timeout: 5000 }, (error, stdout, stderr) => {
      resolve({
        code: typeof error?.code === 'number' ? error.code : 0,
        stdout,
        stderr
      });
    });
  });
}

async function htmlForFormat(formatId, metadataMutator = () => {}) {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const format = registry.formats.find((entry) => entry.id === formatId);
  assert.ok(format, `missing format ${formatId}`);
  const html = await readFile(new URL(format.template, templatesRoot), 'utf8');
  const metadata = {
    formatId,
    templateVersion: `${formatId}@1`,
    skillVersion: 'alexandrai-research-publishing@0.2.0',
    language: 'en',
    primaryCategory: 'computer-science.distributed-systems',
    secondaryCategories: [],
    topics: ['release readiness', 'operational review']
  };
  metadataMutator(metadata);
  const metadataScript =
    `<script type="application/json" id="alexandrai-metadata">\n${JSON.stringify(metadata, null, 2)}\n</script>`;
  return metadataRe.test(html)
    ? html.replace(metadataRe, `$1${JSON.stringify(metadata, null, 2)}$2`)
    : html.replace('</body>', `${metadataScript}\n</body>`);
}

test('format registry exposes all 38 html_report_design formats', async () => {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));

  assert.equal(registry.formats.length, expectedFormatCount);
  assert.ok(registry.formats.some((format) => format.id === 'dashboard'));
  assert.ok(registry.formats.some((format) => format.id === 'research-paper'));
  for (const [formatId] of repositoryAnalysisFormats) {
    assert.ok(registry.formats.some((format) => format.id === formatId), `missing ${formatId}`);
  }
  assert.deepEqual(
    registry.formats.find((format) => format.id === 'slide-deck')?.aliases,
    ['presentation']
  );

  for (const format of registry.formats) {
    await readFile(new URL(format.template, templatesRoot), 'utf8');
    await readFile(new URL(format.schema, schemasRoot), 'utf8');
  }
});

test('formats command prints the complete format catalogue', async () => {
  const result = await runCli(['formats']);

  assert.equal(result.code, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.ok, true);
  assert.equal(body.formats.length, expectedFormatCount);
  assert.ok(body.formats.some((format) => format.id === 'dashboard'));
  assert.ok(body.formats.some((format) => format.id === 'research-paper'));
  for (const [formatId] of repositoryAnalysisFormats) {
    assert.ok(body.formats.some((format) => format.id === formatId), `missing ${formatId}`);
  }
});

test('lint accepts a non-paper template when selected format metadata matches', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'alexandrai-dashboard-'));
  try {
    const file = join(dir, 'dashboard.html');
    await writeFile(file, await htmlForFormat('dashboard'), 'utf8');

    const result = await runCli(['lint', file, '--format', 'dashboard', '--offline']);

    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /ALEXANDRAI_LINT_OK/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('lint accepts repository and system analysis templates', async () => {
  for (const [formatId, templateName] of repositoryAnalysisFormats) {
    const dir = await mkdtemp(join(tmpdir(), `alexandrai-${formatId}-`));
    try {
      const file = join(dir, templateName);
      await writeFile(file, await htmlForFormat(formatId), 'utf8');

      const result = await runCli(['lint', file, '--format', formatId, '--offline']);

      assert.equal(result.code, 0, result.stderr);
      assert.match(result.stdout, /ALEXANDRAI_LINT_OK/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }
});

test('lint rejects mismatched request format and HTML metadata format', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'alexandrai-format-mismatch-'));
  try {
    const file = join(dir, 'dashboard.html');
    await writeFile(file, await htmlForFormat('dashboard'), 'utf8');

    const result = await runCli(['lint', file, '--format', 'one-pager', '--offline']);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /FORMAT_MISMATCH/);
    assert.match(result.stderr, /alexandrai-metadata\.formatId/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('lint rejects non-English AlexandrAI metadata topics', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'alexandrai-topic-language-'));
  try {
    const file = join(dir, 'dashboard.html');
    await writeFile(
      file,
      await htmlForFormat('dashboard', (metadata) => {
        metadata.topics = ['운영 점검'];
      }),
      'utf8'
    );

    const result = await runCli(['lint', file, '--format', 'dashboard', '--offline']);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /NON_ENGLISH_TOPIC/);
    assert.match(result.stderr, /alexandrai-metadata\.topics\[0\]/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
