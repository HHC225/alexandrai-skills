import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const templatePath = new URL('../skills/alexandrai-research-publishing/assets/research-paper-template.html', import.meta.url);

async function readTemplate() {
  return readFile(templatePath, 'utf8');
}

function sliceBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, `missing start marker: ${start}`);
  const endIndex = text.indexOf(end, startIndex);
  assert.notEqual(endIndex, -1, `missing end marker: ${end}`);
  return text.slice(startIndex, endIndex);
}

test('research paper title block renders keywords before the abstract', async () => {
  const template = await readTemplate();
  const titleBlock = sliceBetween(template, 'var head =', '/* ---- sections ---- */');

  const keywordsIndex = titleBlock.indexOf('<p class="rp-keywords"');
  const abstractIndex = titleBlock.indexOf('<div class="rp-abstract"');

  assert.notEqual(keywordsIndex, -1, 'missing keywords render fragment');
  assert.notEqual(abstractIndex, -1, 'missing abstract render fragment');
  assert.ok(keywordsIndex < abstractIndex, 'keywords should render above the abstract box');
});

test('research paper title block masthead does not repeat author or date', async () => {
  const template = await readTemplate();
  const titleBlock = sliceBetween(template, 'var head =', '/* ---- sections ---- */');

  assert.doesNotMatch(titleBlock, /corr\.name/, 'title block should not render the corresponding author again');
  assert.doesNotMatch(titleBlock, /p\.date\s*\|\|\s*m\.date/, 'title block should not render the paper or meta date');
});

test('research paper title block omits the secondary masthead line', async () => {
  const template = await readTemplate();
  const titleBlock = sliceBetween(template, 'var head =', '/* ---- sections ---- */');

  assert.doesNotMatch(titleBlock, /rp-masthead/, 'title block should not render a secondary metadata line');
});
