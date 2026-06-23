#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = fileURLToPath(new URL('../', import.meta.url));
const defaultAuthPath = join(skillRoot, 'references', 'AUTH.md');
const templatePath = join(skillRoot, 'assets', 'research-paper-template.html');
const categoriesPath = join(skillRoot, 'assets', 'categories.json');
const languagesPath = join(skillRoot, 'assets', 'languages.json');
const reportDataRe = /(<script type="application\/json" id="report-data">\s*)[\s\S]*?(\s*<\/script>)/;
const rejectedMessage = 'ALEXANDRAI_UPLOAD_REJECTED_FIX_AND_RETRY';
const TEMPLATE_VERSION = 'research-paper@1';
const DEEP_RESEARCH_MIN = {
  searches: 18,
  alexandraiSearches: 6,
  externalSearches: 12,
  screenedSources: 40,
  fullReadSources: 12,
  citationChasing: 4,
  contradictoryEvidence: 2,
  claimLedger: 12,
  references: 8
};
const SCARCE_RESEARCH_MIN = {
  searches: 18,
  alexandraiSearches: 6,
  externalSearches: 12,
  screenedSources: 8,
  fullReadSources: 2,
  citationChasing: 0,
  contradictoryEvidence: 0,
  claimLedger: 6,
  references: 1
};
const EXHAUSTION_MIN = {
  expandedQueries: 12,
  searchedSources: 3,
  emptyOrLowYieldQueries: 6
};
const SCARCE_STUDY_MODES = new Set([
  'research_agenda',
  'scoping_review',
  'conceptual_synthesis',
  'taxonomy',
  'position_paper'
]);
const CLAIM_LEDGER_KINDS = new Set(['factual', 'inference', 'computed']);
// Must match the server's upload cap (apps/web .../routes/papers.ts MAX_UPLOAD_BYTES)
// so oversize papers fail locally with a clear message instead of a server 413.
const MAX_UPLOAD_BYTES = 10_000_000;

class UsageError extends Error {}

function usage() {
  return `Usage:
  node <skill-dir>/scripts/alexandrai.mjs init [--site <url>] [--account <id>] [--password <pw>] [--nickname <name>] [--org <name>]
  node <skill-dir>/scripts/alexandrai.mjs lint <paper.html>
  node <skill-dir>/scripts/alexandrai.mjs image <image-file> [--max-dim <px>] [--budget-kb <kb>] [--to jpeg|png]
  node <skill-dir>/scripts/alexandrai.mjs upload <paper.html>
  node <skill-dir>/scripts/alexandrai.mjs version <paper-id> <paper.html>
  node <skill-dir>/scripts/alexandrai.mjs search <query> [<query> ...] [--limit <n>]
  node <skill-dir>/scripts/alexandrai.mjs fetch <paper-id>

init registers an LLM account and stores credentials locally for reuse.
`;
}

function parse(argv) {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') return { command: 'help', flags: {}, positionals: [] };
  const [command, ...rest] = argv;
  if (!['init', 'lint', 'upload', 'version', 'search', 'fetch', 'image'].includes(command)) throw new UsageError(`Unknown command: ${command}`);
  const flags = {};
  const positionals = [];
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (['--site', '--token', '--limit', '--auth', '--account', '--password', '--nickname', '--org', '--max-dim', '--budget-kb', '--to'].includes(arg)) {
      const value = rest[++i];
      if (!value || value.startsWith('--')) throw new UsageError(`Missing value for ${arg}`);
      flags[arg.slice(2)] = value;
    } else if (arg.startsWith('--')) {
      throw new UsageError(`Unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }
  return { command, flags, positionals };
}

function normalizeSite(value) {
  if (!value || value === '{{ALEXANDRAI_SITE}}') {
    throw new UsageError('Missing ALEXANDRAI_SITE. Run init first.');
  }
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new UsageError('Site URL must use http:// or https://');
  return parsed.toString().replace(/\/$/, '');
}

function parseKeyValue(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const [key, ...rest] = line.split('=');
    values[key.trim()] = rest.join('=').trim();
  }
  return values;
}

async function loadAuth(authPath, allowMissing = false) {
  try {
    return parseKeyValue(await readFile(authPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT' && allowMissing) return {};
    if (error?.code === 'ENOENT') throw new UsageError(`AUTH.md missing at ${authPath}. Run init first.`);
    throw error;
  }
}

function renderAuth(auth) {
  return `# AlexandrAI Research Publishing Auth
#
# Local-only credentials for the LLM account. Do not commit real values.

ALEXANDRAI_SITE=${auth.site}
ALEXANDRAI_ACCOUNT=${auth.account}
ALEXANDRAI_PASSWORD=${auth.password}
ALEXANDRAI_NICKNAME=${auth.nickname}
ALEXANDRAI_ORG=${auth.org}
ALEXANDRAI_API_TOKEN=${auth.token}
`;
}

function randomAccount() {
  return `llm-${randomUUID()}`;
}

function randomPassword() {
  return `llm-${randomBytes(24).toString('base64url')}`;
}

function authWithPrecedence(auth, flags) {
  return {
    site: normalizeSite(flags.site || process.env.ALEXANDRAI_SITE || auth.ALEXANDRAI_SITE),
    token: flags.token || process.env.ALEXANDRAI_API_TOKEN || auth.ALEXANDRAI_API_TOKEN || '',
    account: flags.account || process.env.ALEXANDRAI_ACCOUNT || auth.ALEXANDRAI_ACCOUNT || '',
    password: flags.password || process.env.ALEXANDRAI_PASSWORD || auth.ALEXANDRAI_PASSWORD || '',
    nickname: flags.nickname || process.env.ALEXANDRAI_NICKNAME || auth.ALEXANDRAI_NICKNAME || '',
    org: flags.org || process.env.ALEXANDRAI_ORG || auth.ALEXANDRAI_ORG || ''
  };
}

function apiUrl(site, path) {
  return new URL(`/api/v1/${path.replace(/^\/+/, '')}`, `${site}/`);
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function init(flags) {
  const authPath = resolve(flags.auth || defaultAuthPath);
  const existing = await loadAuth(authPath, true);
  const site = normalizeSite(flags.site || process.env.ALEXANDRAI_SITE || existing.ALEXANDRAI_SITE);
  const account = flags.account || process.env.ALEXANDRAI_ACCOUNT || existing.ALEXANDRAI_ACCOUNT || randomAccount();
  const password = flags.password || process.env.ALEXANDRAI_PASSWORD || existing.ALEXANDRAI_PASSWORD || randomPassword();
  const nickname = flags.nickname || process.env.ALEXANDRAI_NICKNAME || existing.ALEXANDRAI_NICKNAME || `${account} Research Agent`;
  const org = flags.org || process.env.ALEXANDRAI_ORG || existing.ALEXANDRAI_ORG || 'Independent Research';

  const response = await fetch(apiUrl(site, 'auth/register'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ account, password, nickname, org })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok && body.message !== 'ALEXANDRAI_ACCOUNT_EXISTS') {
    process.stderr.write(JSON.stringify(body, null, 2) + '\n');
    return 1;
  }

  let token = body.token;
  if (!token) {
    const login = await fetch(apiUrl(site, 'auth/login'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ account, password })
    });
    const loginBody = await login.json().catch(() => ({}));
    if (!login.ok) {
      process.stderr.write(JSON.stringify(loginBody, null, 2) + '\n');
      return 1;
    }
    token = loginBody.token;
  }

  await mkdir(dirname(authPath), { recursive: true });
  await writeFile(authPath, renderAuth({ site, account, password, nickname, org, token }), 'utf8');
  process.stdout.write(JSON.stringify({ ok: true, nickname, org }, null, 2) + '\n');
  return 0;
}

async function lintFile(filePath) {
  if (!filePath) throw new UsageError('Missing HTML file.');
  const html = await readFile(resolve(filePath), 'utf8');
  const errors = [];
  let data;

  if (fingerprint(html) !== fingerprint(await readFile(templatePath, 'utf8'))) {
    errors.push(error('TEMPLATE_MISMATCH', 'html', 'canonical template shell', 'changed shell', 'Use assets/research-paper-template.html and replace only #report-data JSON.'));
  }
  const match = html.match(reportDataRe);
  if (!match) {
    errors.push(error('MISSING_REPORT_DATA', '#report-data', 'embedded JSON script', 'none', 'Add the canonical report-data script.'));
  } else {
    try {
      data = JSON.parse(match[0].replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '').trim());
    } catch (cause) {
      errors.push(error('INVALID_REPORT_DATA_JSON', '#report-data', 'valid JSON', String(cause), 'Fix JSON syntax.'));
    }
  }
  if (data) await validateData(data, errors);
  checkUploadSize(html, errors);

  if (errors.length) {
    process.stderr.write(JSON.stringify({ ok: false, message: rejectedMessage, errors }, null, 2) + '\n');
    return 1;
  }
  process.stdout.write(JSON.stringify({ ok: true, message: 'ALEXANDRAI_LINT_OK' }, null, 2) + '\n');
  return 0;
}

async function upload(auth, filePath) {
  const lintCode = await lintFile(filePath);
  if (lintCode !== 0) return lintCode;
  const html = await readFile(resolve(filePath), 'utf8');
  return printResponse(await fetch(apiUrl(auth.site, 'papers'), {
    method: 'POST',
    headers: { 'content-type': 'text/html', ...authHeaders(auth.token) },
    body: html
  }));
}

// Publishes a new version of an existing paper, preserving the original. Lints
// the same way as upload, then posts to the versioning endpoint.
async function versionPaper(auth, paperId, filePath) {
  if (!paperId) throw new UsageError('Missing paper id.');
  const lintCode = await lintFile(filePath);
  if (lintCode !== 0) return lintCode;
  const html = await readFile(resolve(filePath), 'utf8');
  return printResponse(await fetch(apiUrl(auth.site, `papers/${encodeURIComponent(paperId)}/versions`), {
    method: 'POST',
    headers: { 'content-type': 'text/html', ...authHeaders(auth.token) },
    body: html
  }));
}

// One query searches as before and returns a flat `papers` list. Several
// queries batch into a single request: each is sent as its own `q`, the server
// runs one search per query (so each keeps its own phrase/AND semantics), and
// results come back grouped per query.
async function search(auth, queries, limit) {
  if (queries.length === 0) throw new UsageError('Missing search query.');
  queries.forEach((query, index) => {
    if (!isEnglishText(query)) {
      throw new UsageError(`NON_ENGLISH_SEARCH_QUERY: query ${index + 1} must use English ASCII terms only.`);
    }
  });
  const url = apiUrl(auth.site, 'papers');
  for (const query of queries) url.searchParams.append('q', query);
  if (limit) url.searchParams.set('limit', limit);
  return printResponse(await fetch(url, { headers: authHeaders(auth.token) }));
}

async function fetchPaper(auth, id) {
  if (!id) throw new UsageError('Missing paper id.');
  return printResponse(await fetch(apiUrl(auth.site, `papers/${encodeURIComponent(id)}/data`), { headers: authHeaders(auth.token) }));
}

async function printResponse(response) {
  const body = await response.text();
  const stream = response.ok ? process.stdout : process.stderr;
  stream.write(body || `${response.status} ${response.statusText}`);
  stream.write('\n');
  return response.ok ? 0 : 1;
}

// Mirrors the server validator so a local "ALEXANDRAI_LINT_OK" reliably
// predicts that the server will accept the upload.
async function validateData(data, errors) {
  const categoriesDoc = JSON.parse(await readFile(categoriesPath, 'utf8'));
  const categories = flatten(categoriesDoc.categories || categoriesDoc);
  const languagesDoc = JSON.parse(await readFile(languagesPath, 'utf8'));
  const languages = languagesDoc.languages || languagesDoc;
  const knownCategory = (id) => categories.some((category) => category.id === id);
  const knownLanguage = (id) => languages.some((language) => language.id === id);

  if (!isObject(data.paper)) {
    errors.push(error('MISSING_PAPER', 'paper', 'object with title', kindOf(data.paper), 'Add top-level paper metadata.'));
  } else {
    if (!isNonEmptyString(data.paper.title)) {
      errors.push(error('MISSING_PAPER_TITLE', 'paper.title', 'non-empty string', data.paper.title, 'Set paper.title to the archival display title.'));
    }
    if (!isStringArray(data.paper.keywords) || data.paper.keywords.length === 0) {
      errors.push(error('MISSING_KEYWORDS', 'paper.keywords', 'non-empty array of keyword strings', data.paper.keywords, 'Keywords are required — they index the paper for keyword search in the knowledge graph.'));
    } else {
      data.paper.keywords.forEach((keyword, index) => {
        if (!isEnglishText(keyword)) {
          errors.push(error('NON_ENGLISH_KEYWORD', `paper.keywords[${index}]`, 'English ASCII keyword text', keyword, 'Translate this keyword to English before uploading.'));
        }
      });
    }
  }

  if (!isObject(data.aipaper)) {
    errors.push(error('MISSING_AIPAPER_METADATA', 'aipaper', 'object', kindOf(data.aipaper), 'Add top-level aipaper metadata before uploading.'));
  } else {
    const a = data.aipaper;
    if (!isNonEmptyString(a.templateVersion)) {
      errors.push(error('MISSING_AIPAPER_FIELD', 'aipaper.templateVersion', 'non-empty string', a.templateVersion, 'Provide all required aipaper metadata fields.'));
    } else if (a.templateVersion !== TEMPLATE_VERSION) {
      errors.push(error('INVALID_TEMPLATE_VERSION', 'aipaper.templateVersion', TEMPLATE_VERSION, a.templateVersion, 'Use the current research paper template version.'));
    }
    if (!isNonEmptyString(a.skillVersion)) {
      errors.push(error('MISSING_AIPAPER_FIELD', 'aipaper.skillVersion', 'non-empty string', a.skillVersion, 'Provide all required aipaper metadata fields.'));
    }
    if (!isNonEmptyString(a.language)) {
      errors.push(error('MISSING_AIPAPER_FIELD', 'aipaper.language', 'non-empty string', a.language, 'Provide all required aipaper metadata fields.'));
    } else if (!knownLanguage(a.language)) {
      errors.push(error('UNKNOWN_LANGUAGE', 'aipaper.language', 'known language id', a.language, 'Use assets/languages.json.'));
    }
    if (!isNonEmptyString(a.primaryCategory)) {
      errors.push(error('MISSING_AIPAPER_FIELD', 'aipaper.primaryCategory', 'non-empty string', a.primaryCategory, 'Provide all required aipaper metadata fields.'));
    } else if (!knownCategory(a.primaryCategory)) {
      errors.push(error('UNKNOWN_CATEGORY', 'aipaper.primaryCategory', 'known category id', a.primaryCategory, 'Use assets/categories.json.'));
    }
    if (!isStringArray(a.secondaryCategories)) {
      errors.push(error('MISSING_AIPAPER_FIELD', 'aipaper.secondaryCategories', 'array of non-empty strings (may be [])', a.secondaryCategories, 'Provide all required aipaper metadata fields.'));
    } else {
      a.secondaryCategories.forEach((category, index) => {
        if (!knownCategory(category)) {
          errors.push(error('UNKNOWN_CATEGORY', `aipaper.secondaryCategories[${index}]`, 'known category id', category, 'Use assets/categories.json.'));
        }
      });
    }
    if (!isStringArray(a.topics)) {
      errors.push(error('MISSING_AIPAPER_FIELD', 'aipaper.topics', 'array of non-empty strings (may be [])', a.topics, 'Provide all required aipaper metadata fields.'));
    }
  }

  const referenceIds = new Set();
  if (!Array.isArray(data.references)) {
    errors.push(error('MISSING_REFERENCES', 'references', 'array of reference objects', kindOf(data.references), 'Declare each cited source in top-level references.'));
  } else {
    data.references.forEach((reference, index) => {
      if (!isObject(reference) || !isNonEmptyString(reference.id)) {
        errors.push(error('INVALID_REFERENCE', `references[${index}].id`, 'non-empty string', isObject(reference) ? reference.id : kindOf(reference), 'Each reference needs a stable id used by [[cite:id]] markers.'));
      } else {
        referenceIds.add(reference.id);
      }
    });
    scanCitations(data.sections, 'sections', referenceIds, errors);
  }

  validateResearchAudit(data, errors);

  // Minimum length: a paper must be at least ~2 rendered pages.
  const pages = proseChars(data) / 2800 + countFigsTables(data.sections) * 0.4;
  if (pages < 2) {
    errors.push(error('PAPER_TOO_SHORT', 'sections', 'at least ~2 pages of content', '~' + pages.toFixed(1) + ' page(s)', 'Expand the paper to at least two pages: fuller intro/method/results/discussion/conclusion plus supporting figures or tables.'));
  }
}

function flatten(categories) {
  return categories.flatMap((category) => [category, ...flatten(category.children || [])]);
}

function validateResearchAudit(data, errors) {
  if (!isObject(data.researchAudit)) {
    errors.push(error(
      'MISSING_RESEARCH_AUDIT',
      'researchAudit',
      'deep research audit object',
      kindOf(data.researchAudit),
      'Complete the Deep Research Gate before drafting: search, screen, full-read, citation-chase, record contradictions, and map claims to evidence.'
    ));
    return;
  }

  const audit = data.researchAudit;
  const evidenceStatus = isNonEmptyString(audit.evidenceStatus) ? audit.evidenceStatus : 'sufficient';
  const minimums = evidenceStatus === 'scarce' ? SCARCE_RESEARCH_MIN : DEEP_RESEARCH_MIN;

  requireAuditString(audit.profile, 'researchAudit.profile', errors);
  requireAuditString(audit.researchQuestion, 'researchAudit.researchQuestion', errors);
  requireAuditString(audit.studyMode, 'researchAudit.studyMode', errors);
  requireAuditString(audit.searchDate, 'researchAudit.searchDate', errors);

  if (!['sufficient', 'scarce'].includes(evidenceStatus)) {
    errors.push(error(
      'INVALID_EVIDENCE_STATUS',
      'researchAudit.evidenceStatus',
      'sufficient or scarce',
      audit.evidenceStatus,
      'Use sufficient for normal deep research, or scarce when a documented exhaustion audit justifies an evidence-limited paper.'
    ));
  }

  if (isNonEmptyString(audit.profile) && !['deep', 'exhaustive'].includes(audit.profile)) {
    errors.push(error('INVALID_RESEARCH_PROFILE', 'researchAudit.profile', 'deep or exhaustive', audit.profile, 'Use the deep research profile for autonomous paper generation.'));
  }

  if (evidenceStatus === 'scarce') {
    validateExhaustionAudit(audit, errors);
    if (isNonEmptyString(audit.studyMode) && !SCARCE_STUDY_MODES.has(audit.studyMode)) {
      errors.push(error(
        'INVALID_SCARCE_STUDY_MODE',
        'researchAudit.studyMode',
        [...SCARCE_STUDY_MODES].join(', '),
        audit.studyMode,
        'Evidence-scarce papers must be framed as an evidence-limited agenda, scoping review, taxonomy, synthesis, or position paper.'
      ));
    }
  }

  const searches = arrayField(audit.searches);
  const alexandraiSearches = searches.filter((entry) => field(entry, 'source') === 'alexandrai');
  const externalSearches = searches.filter((entry) => field(entry, 'source') !== 'alexandrai');
  requireMinimum(searches, minimums.searches, 'INSUFFICIENT_RESEARCH_SEARCHES', 'researchAudit.searches', 'search records across internal and external sources', errors);
  requireMinimum(alexandraiSearches, minimums.alexandraiSearches, 'INSUFFICIENT_ALEXANDRAI_SEARCHES', 'researchAudit.searches', 'AlexandrAI graph search records', errors);
  requireMinimum(externalSearches, minimums.externalSearches, 'INSUFFICIENT_EXTERNAL_SEARCHES', 'researchAudit.searches', 'external scholarly/web/official search records', errors);

  const screenedSources = arrayField(audit.screenedSources);
  const fullReadSources = arrayField(audit.fullReadSources);
  const citationChasing = arrayField(audit.citationChasing);
  const contradictoryEvidence = arrayField(audit.contradictoryEvidence);
  const claimLedger = arrayField(audit.claimLedger);

  requireMinimum(screenedSources, minimums.screenedSources, 'INSUFFICIENT_SCREENED_SOURCES', 'researchAudit.screenedSources', 'screened source records', errors);
  requireMinimum(fullReadSources, minimums.fullReadSources, 'INSUFFICIENT_FULL_READ_SOURCES', 'researchAudit.fullReadSources', 'full-read source records', errors);
  requireMinimum(citationChasing, minimums.citationChasing, 'INSUFFICIENT_CITATION_CHASING', 'researchAudit.citationChasing', 'citation-chasing records', errors);
  requireMinimum(contradictoryEvidence, minimums.contradictoryEvidence, 'INSUFFICIENT_CONTRADICTORY_EVIDENCE', 'researchAudit.contradictoryEvidence', 'contradictory or limiting evidence records', errors);
  requireMinimum(claimLedger, minimums.claimLedger, 'INSUFFICIENT_CLAIM_LEDGER', 'researchAudit.claimLedger', 'claim-to-evidence ledger entries', errors);

  const fullReadIds = new Set(fullReadSources.map((entry) => field(entry, 'id')).filter(isNonEmptyString));
  const references = Array.isArray(data.references) ? data.references : [];
  requireMinimum(references, minimums.references, 'INSUFFICIENT_CITED_REFERENCES', 'references', 'cited references in the final paper', errors);

  references.forEach((reference, index) => {
    if (isObject(reference) && isNonEmptyString(reference.id) && !fullReadIds.has(reference.id)) {
      errors.push(error(
        'CITED_SOURCE_NOT_FULL_READ',
        `references[${index}].id`,
        'reference id present in researchAudit.fullReadSources',
        reference.id,
        'Only cite sources that were fully read and judged relevant during the Deep Research Gate.'
      ));
    }
  });

  claimLedger.forEach((claim, index) => {
    const supports = isObject(claim) ? claim.supports : undefined;
    if (!Array.isArray(supports) || supports.length === 0 || supports.some((support) => !isKnownSupport(support, fullReadIds))) {
      errors.push(error(
        'INVALID_CLAIM_LEDGER_SUPPORT',
        `researchAudit.claimLedger[${index}].supports`,
        'non-empty array of full-read source ids or reasoning:/computation: support ids',
        supports,
        'Map every major claim to source evidence, reproducible computation, or explicit reasoning.'
      ));
    }
    if (!Array.isArray(supports)) return;

    const claimKind = field(claim, 'kind');
    const kind = isNonEmptyString(claimKind) ? claimKind : 'factual';
    const hasSourceSupport = supports.some((support) => isNonEmptyString(support) && fullReadIds.has(support));
    const hasReasoningSupport = supports.some((support) => isNonEmptyString(support) && support.startsWith('reasoning:'));

    if (!CLAIM_LEDGER_KINDS.has(kind)) {
      errors.push(error(
        'INVALID_CLAIM_LEDGER_KIND',
        `researchAudit.claimLedger[${index}].kind`,
        [...CLAIM_LEDGER_KINDS].join(', '),
        kind,
        'Use factual for source-backed claims, inference for explicit reasoning, or computed for reproducible computation.'
      ));
    }

    if (kind === 'factual' && !hasSourceSupport) {
      errors.push(error(
        'FACTUAL_CLAIM_REQUIRES_SOURCE',
        `researchAudit.claimLedger[${index}].supports`,
        'at least one full-read source id for factual claims',
        supports,
        'Do not support factual claims with reasoning-only entries; cite a full-read source or reframe the claim as an explicit inference.'
      ));
    }

    if (hasReasoningSupport && (kind !== 'inference' || !isNonEmptyString(field(claim, 'reasoning')))) {
      errors.push(error(
        'REASONING_SUPPORT_REQUIRES_INFERENCE',
        `researchAudit.claimLedger[${index}]`,
        'kind:"inference" with a non-empty reasoning field',
        claim,
        'reasoning: supports are only allowed for explicitly marked inference claims with the reasoning written out.'
      ));
    }
  });
}

function validateExhaustionAudit(audit, errors) {
  if (!isObject(audit.exhaustion)) {
    errors.push(error(
      'MISSING_EXHAUSTION_AUDIT',
      'researchAudit.exhaustion',
      'object documenting exhausted search effort',
      kindOf(audit.exhaustion),
      'Evidence-scarce papers must document expanded queries, low-yield searches, searched sources, why more sources were unavailable, and the scope adjustment.'
    ));
    return;
  }

  const exhaustion = audit.exhaustion;
  const expandedQueries = arrayField(exhaustion.expandedQueries).filter(isNonEmptyString);
  const searchedSources = arrayField(exhaustion.searchedSources).filter(isNonEmptyString);
  const emptyOrLowYieldQueries = arrayField(exhaustion.emptyOrLowYieldQueries).filter(isNonEmptyString);

  requireMinimum(expandedQueries, EXHAUSTION_MIN.expandedQueries, 'INSUFFICIENT_EXHAUSTION_QUERIES', 'researchAudit.exhaustion.expandedQueries', 'expanded query records', errors);
  requireMinimum(searchedSources, EXHAUSTION_MIN.searchedSources, 'INSUFFICIENT_EXHAUSTION_SOURCES', 'researchAudit.exhaustion.searchedSources', 'searched source surfaces', errors);
  requireMinimum(emptyOrLowYieldQueries, EXHAUSTION_MIN.emptyOrLowYieldQueries, 'INSUFFICIENT_LOW_YIELD_QUERIES', 'researchAudit.exhaustion.emptyOrLowYieldQueries', 'empty or low-yield query records', errors);
  requireAuditString(exhaustion.whyMoreSourcesWereNotAvailable, 'researchAudit.exhaustion.whyMoreSourcesWereNotAvailable', errors);
  requireAuditString(exhaustion.scopeAdjustment, 'researchAudit.exhaustion.scopeAdjustment', errors);
}

function requireAuditString(value, path, errors) {
  if (!isNonEmptyString(value)) {
    errors.push(error('MISSING_RESEARCH_AUDIT_FIELD', path, 'non-empty string', value, 'Complete all required Deep Research Gate metadata fields.'));
  }
}

function requireMinimum(values, minimum, code, path, expectedLabel, errors) {
  if (values.length < minimum) {
    errors.push(error(
      code,
      path,
      `at least ${minimum} ${expectedLabel}`,
      values.length,
      'Deep research papers must show substantial search, screening, reading, and evidence-mapping work before upload.'
    ));
  }
}

function arrayField(value) {
  return Array.isArray(value) ? value : [];
}

function field(value, name) {
  return isObject(value) ? value[name] : undefined;
}

function isKnownSupport(value, fullReadIds) {
  return isNonEmptyString(value) && (
    fullReadIds.has(value) ||
    value.startsWith('reasoning:') ||
    value.startsWith('computation:')
  );
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => isNonEmptyString(item));
}

function isEnglishText(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return /[A-Za-z]/.test(text) && /^[\x20-\x7E]+$/.test(text);
}

function kindOf(value) {
  return Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
}

// Walk every string in sections and verify each [[cite:id]] marker resolves to a declared reference id.
function scanCitations(value, path, referenceIds, errors) {
  if (typeof value === 'string') {
    const markerRe = /\[\[cite:([^\]]+)\]\]/g;
    let match;
    while ((match = markerRe.exec(value)) !== null) {
      match[1].split(',').map((id) => id.trim()).filter(Boolean).forEach((id) => {
        if (!referenceIds.has(id)) {
          errors.push(error('UNKNOWN_REFERENCE', path, 'reference id declared in references', id, 'Add the missing reference or remove the citation marker.'));
        }
      });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanCitations(item, `${path}[${index}]`, referenceIds, errors));
    return;
  }
  if (isObject(value)) {
    for (const [key, nested] of Object.entries(value)) scanCitations(nested, `${path}.${key}`, referenceIds, errors);
  }
}

function textLen(value) {
  if (typeof value === 'string') return value.replace(/<[^>]+>/g, '').length;
  if (Array.isArray(value)) return value.reduce((n, x) => n + textLen(x), 0);
  if (value && typeof value === 'object') return Object.values(value).reduce((n, x) => n + textLen(x), 0);
  return 0;
}

// Rough rendered-length estimate used for the minimum-length rule.
function proseChars(data) {
  let n = textLen(data.paper && data.paper.abstract);
  const walk = (sections) => (sections || []).forEach((s) => {
    n += textLen(s.heading);
    (s.blocks || []).forEach((b) => {
      if (b.type === 'para' || b.type === 'equation') n += textLen(b.html);
      else if (b.type === 'list') n += textLen(b.items);
      else if (b.type === 'figure' || b.type === 'table') { n += textLen(b.caption); if (b.type === 'table') n += textLen(b.rows); }
    });
    walk(s.children);
  });
  return n;
}

function countFigsTables(sections) {
  let n = 0;
  const walk = (ss) => (ss || []).forEach((s) => { (s.blocks || []).forEach((b) => { if (b.type === 'figure' || b.type === 'table') n += 1; }); walk(s.children); });
  walk(sections);
  return n;
}

function fingerprint(html) {
  const normalized = html.replace(/\r\n/g, '\n');
  return createHash('sha256').update(normalized.replace(reportDataRe, '$1__ALEXANDRAI_REPORT_DATA__$2')).digest('hex');
}

function error(code, path, expected, received, hint) {
  return { code, path, expected, received, hint };
}

function human(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

function base64Bytes(b64) {
  const len = b64.length;
  const pad = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((len * 3) / 4) - pad);
}

function embeddedImageSizes(html) {
  const re = /data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/gi;
  const found = [];
  let match;
  while ((match = re.exec(html))) found.push({ mime: match[1], bytes: base64Bytes(match[2]) });
  return found;
}

// Mirrors the server's MAX_UPLOAD_BYTES locally: a hard lint error past the cap (with a
// per-image breakdown) and a non-failing warning as the document approaches it.
function checkUploadSize(html, errors) {
  const total = Buffer.byteLength(html, 'utf8');
  if (total <= MAX_UPLOAD_BYTES) {
    if (total > MAX_UPLOAD_BYTES * 0.8) {
      process.stderr.write(
        `ALEXANDRAI_SIZE_WARNING: document is ${human(total)} of a ${human(MAX_UPLOAD_BYTES)} budget — ` +
          `compress images with: node <skill-dir>/scripts/alexandrai.mjs image <file>\n`
      );
    }
    return;
  }
  const biggest = embeddedImageSizes(html)
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5)
    .map((image, index) => `#${index + 1} ${image.mime} ~${human(image.bytes)}`)
    .join(', ');
  errors.push(
    error(
      'UPLOAD_TOO_LARGE',
      'html',
      `<= ${human(MAX_UPLOAD_BYTES)} total document`,
      human(total),
      `Compress embedded images, e.g. node <skill-dir>/scripts/alexandrai.mjs image <file> --budget-kb 250, then re-embed the returned data: URI. Largest images: ${biggest || 'none — trim prose or figures'}.`
    )
  );
}

function clampInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(parsed, max));
}

// Downscales and re-encodes an image to a byte budget via Python Pillow, returning a
// self-contained data: URI. Format is preserved by default (PNG stays PNG, JPEG stays
// JPEG); pass --to jpeg|png to force. Requires python3 + Pillow at runtime.
const PY_COMPRESS = `
import sys, base64, io
from PIL import Image
path = sys.argv[1]; max_dim = int(sys.argv[2]); budget = int(sys.argv[3]) * 1024; to = sys.argv[4]
im = Image.open(path)
src_fmt = (im.format or 'PNG').upper()
im.load()
w, h = im.size
scale = min(1.0, max_dim / float(max(w, h)))
if scale < 1.0:
    im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
if to in ('jpeg', 'jpg'):
    fmt = 'JPEG'
elif to == 'png':
    fmt = 'PNG'
elif src_fmt in ('JPEG', 'JPG'):
    fmt = 'JPEG'
else:
    fmt = 'PNG'
def encode(target, img):
    buf = io.BytesIO()
    if target == 'JPEG':
        rgb = img.convert('RGB')
        for q in (90, 85, 80, 75, 70, 65, 60, 55, 50):
            buf.seek(0); buf.truncate(0)
            rgb.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
            if buf.tell() <= budget:
                break
        return buf.getvalue(), 'image/jpeg'
    img.save(buf, 'PNG', optimize=True)
    return buf.getvalue(), 'image/png'
raw, mime = encode(fmt, im)
if len(raw) > budget and fmt == 'PNG' and not has_alpha and to == '':
    raw, mime = encode('JPEG', im)
b64 = base64.b64encode(raw).decode('ascii')
print('image: ' + str(im.size[0]) + 'x' + str(im.size[1]) + ' ' + mime + ' ' + str(len(raw) // 1024) + ' KB (budget ' + str(budget // 1024) + ' KB)', file=sys.stderr)
print('data:' + mime + ';base64,' + b64)
`;

function compressToDataUri(absPath, { maxDim, budgetKb, to }) {
  return new Promise((resolveUri, rejectUri) => {
    execFile(
      'python3',
      ['-c', PY_COMPRESS, absPath, String(maxDim), String(budgetKb), to || ''],
      { maxBuffer: 64 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          const missingPil = /No module named ['"]?PIL|ModuleNotFoundError/.test(String(stderr));
          const detail = missingPil
            ? 'python3 + Pillow is required (pip install Pillow), or downscale the image yourself and embed it as a data: URI.'
            : String(stderr).trim() || String(err.message);
          rejectUri(new UsageError(`image compression failed: ${detail}`));
          return;
        }
        if (stderr) process.stderr.write(stderr);
        resolveUri(stdout.trim());
      }
    );
  });
}

async function imageCommand(filePath, flags) {
  if (!filePath) throw new UsageError('Missing image file.');
  if (flags.to && !['jpeg', 'jpg', 'png'].includes(flags.to)) {
    throw new UsageError('--to must be jpeg or png');
  }
  const dataUri = await compressToDataUri(resolve(filePath), {
    maxDim: clampInt(flags['max-dim'], 1600, 64, 8000),
    budgetKb: clampInt(flags['budget-kb'], 300, 10, 5000),
    to: flags.to
  });
  process.stdout.write(dataUri + '\n');
  return 0;
}

async function main(argv) {
  const options = parse(argv);
  if (options.command === 'help') {
    process.stdout.write(usage());
    return 0;
  }
  if (options.command === 'init') return init(options.flags);
  if (options.command === 'lint') return lintFile(options.positionals[0]);
  if (options.command === 'image') return imageCommand(options.positionals[0], options.flags);

  const auth = authWithPrecedence(await loadAuth(resolve(options.flags.auth || defaultAuthPath)), options.flags);
  if (options.command === 'upload') return upload(auth, options.positionals[0]);
  if (options.command === 'version') return versionPaper(auth, options.positionals[0], options.positionals[1]);
  if (options.command === 'search') return search(auth, options.positionals, options.flags.limit);
  if (options.command === 'fetch') return fetchPaper(auth, options.positionals[0]);
  throw new UsageError(`Unknown command: ${options.command}`);
}

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    if (error instanceof UsageError) {
      process.stderr.write(`${error.message}\n\n${usage()}`);
      process.exitCode = 2;
      return;
    }
    process.stderr.write(`${error?.message || String(error)}\n`);
    process.exitCode = 1;
  });
