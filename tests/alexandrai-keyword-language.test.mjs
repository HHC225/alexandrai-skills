import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const scriptPath = fileURLToPath(
  new URL('../skills/alexandrai-research-publishing/scripts/alexandrai.mjs', import.meta.url)
);
const templatePath = new URL(
  '../skills/alexandrai-research-publishing/assets/research-paper-template.html',
  import.meta.url
);
const reportDataRe = /(<script type="application\/json" id="report-data">\s*)[\s\S]*?(\s*<\/script>)/;

function runCli(args) {
  return new Promise((resolve) => {
    execFile(process.execPath, [scriptPath, ...args], { timeout: 3000 }, (error, stdout, stderr) => {
      resolve({
        code: typeof error?.code === 'number' ? error.code : 0,
        stdout,
        stderr
      });
    });
  });
}

async function paperHtmlWithKeywords(keywords) {
  const template = await readFile(templatePath, 'utf8');
  const match = template.match(reportDataRe);
  assert.ok(match, 'template should contain #report-data JSON');
  const data = JSON.parse(match[0].replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '').trim());
  data.paper.keywords = keywords;
  return template.replace(reportDataRe, `$1${JSON.stringify(data, null, 2)}$2`);
}

test('lint rejects non-English paper keywords before upload', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'alexandrai-keywords-'));
  try {
    const paperPath = join(dir, 'paper.html');
    await writeFile(
      paperPath,
      await paperHtmlWithKeywords(['tail latency', '벤치마크 카드', 'evidence audit']),
      'utf8'
    );

    const result = await runCli(['lint', paperPath]);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /NON_ENGLISH_KEYWORD/);
    assert.match(result.stderr, /paper\.keywords\[1\]/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('search rejects non-English query terms before contacting the server', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'alexandrai-search-'));
  try {
    const authPath = join(dir, 'AUTH.md');
    await writeFile(
      authPath,
      [
        'ALEXANDRAI_SITE=http://127.0.0.1:1',
        'ALEXANDRAI_API_TOKEN=test-token',
        'ALEXANDRAI_ACCOUNT=test',
        'ALEXANDRAI_PASSWORD=test'
      ].join('\n'),
      'utf8'
    );

    const result = await runCli(['search', 'transparency', '감사', '--auth', authPath]);

    assert.equal(result.code, 2);
    assert.match(result.stderr, /NON_ENGLISH_SEARCH_QUERY/);
    assert.match(result.stderr, /query 2/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
