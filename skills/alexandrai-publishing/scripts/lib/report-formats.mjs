import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const skillRoot = fileURLToPath(new URL('../../', import.meta.url));
export const formatsRoot = join(skillRoot, 'assets', 'report-formats');
export const registryPath = join(formatsRoot, 'registry.json');

export const REPORT_DATA_PATTERN =
  /(<script\b(?=[^>]*\bid=["']report-data["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>)[\s\S]*?(<\/script>)/i;
export const REPORT_DATA_SCRIPT_RE =
  /<script\b(?=[^>]*\bid=["']report-data["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/i;
export const ALEXANDRAI_METADATA_PATTERN =
  /(\s*)<script\b(?=[^>]*\bid=["']alexandrai-metadata["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>[\s\S]*?<\/script>(\s*)/i;
export const ALEXANDRAI_METADATA_SCRIPT_RE =
  /<script\b(?=[^>]*\bid=["']alexandrai-metadata["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/i;
export const HTML_TITLE_RE = /(<title\b[^>]*>)([\s\S]*?)(<\/title>)/i;
export const BROWSER_TITLE_SCRIPT_RE =
  /\s*<script\b(?=[^>]*\bid=["']alexandrai-browser-title["'])[^>]*>[\s\S]*?<\/script>\s*/i;
export const TEMPLATE_PLACEHOLDER_RE = /\{\{[^}]+\}\}/;
// Identity-chrome placeholders that must be resolved before publishing (org wordmark,
// project, author, report type, date). Scoped to these exact SCREAMING_CASE tokens so a
// legitimate `{{ var }}` inside authored code/prose content is never falsely rejected.
export const IDENTITY_PLACEHOLDER_RE = /\{\{\s*(ORG|PROJECT|AUTHOR|REPORT_TYPE|DATE)\s*\}\}/;

let registryCache;

export async function loadFormatRegistry() {
  if (!registryCache) {
    registryCache = JSON.parse(await readFile(registryPath, 'utf8'));
  }
  return registryCache;
}

export async function listFormats() {
  return (await loadFormatRegistry()).formats;
}

export async function resolveFormat(idOrAlias) {
  const requested = String(idOrAlias || '').trim();
  if (!requested) return undefined;
  const normalized = requested.toLowerCase();
  return (await listFormats()).find(
    (format) => format.id === normalized || (format.aliases || []).includes(normalized)
  );
}

export async function requireFormat(idOrAlias) {
  const format = await resolveFormat(idOrAlias);
  if (!format) {
    throw new Error(`UNKNOWN_FORMAT: ${idOrAlias}`);
  }
  return format;
}

export function templatePathFor(format) {
  return join(formatsRoot, 'templates', format.template);
}

export function schemaPathFor(format) {
  return join(formatsRoot, 'schemas', format.schema);
}

export async function readFormatTemplate(format) {
  return readFile(templatePathFor(format), 'utf8');
}

export async function readFormatSchema(format) {
  return JSON.parse(await readFile(schemaPathFor(format), 'utf8'));
}

export function extractReportData(html) {
  const match = REPORT_DATA_SCRIPT_RE.exec(html);
  if (!match) throw new Error('Missing <script type="application/json" id="report-data"> block.');
  return parseJsonScript(match[1], '#report-data');
}

export function tryExtractMetadata(html) {
  const match = ALEXANDRAI_METADATA_SCRIPT_RE.exec(html);
  if (!match) return undefined;
  return parseJsonScript(match[1], '#alexandrai-metadata');
}

export function legacyMetadataFromReportData(data) {
  if (!isObject(data?.aipaper)) return undefined;
  const templateVersion =
    typeof data.aipaper.templateVersion === 'string' ? data.aipaper.templateVersion : '';
  return {
    ...data.aipaper,
    formatId: templateVersion.split('@')[0] || 'research-paper',
    templateVersion
  };
}

export function normalizeTemplateShell(html) {
  return html
    .replace(ALEXANDRAI_METADATA_PATTERN, '')
    .replace(REPORT_DATA_PATTERN, '$1__ALEXANDRAI_REPORT_DATA__$2')
    .replace(/\s+<\/body>/i, '</body>')
    .replace(/\r\n/g, '\n');
}

export function templateFingerprint(html) {
  return createHash('sha256').update(normalizeTemplateShell(html)).digest('hex');
}

export async function expectedFingerprints(format) {
  return new Set([templateFingerprint(await readFormatTemplate(format))]);
}

export function extractHtmlTitle(html) {
  return HTML_TITLE_RE.exec(html)?.[2] || '';
}

export function hasTemplatePlaceholder(value) {
  return TEMPLATE_PLACEHOLDER_RE.test(String(value || ''));
}

export function deriveBrowserTitle(data, format = {}) {
  const meta = isObject(data?.meta) ? data.meta : isObject(data?.aipaper) ? data.aipaper : {};
  const paper = isObject(data?.paper) ? data.paper : {};
  const product = isObject(data?.product) ? data.product : {};
  const reportType = firstTitlePart(meta.reportType, meta.type);
  const title = firstTitlePart(meta.title, paper.title, data?.title, product.name, format.label, 'AlexandrAI Report');
  const project = firstTitlePart(meta.project);
  const head = reportType && reportType !== title ? `${reportType} — ${title}` : title;
  const full = [head, project && project !== title ? project : ''].filter(Boolean).join(' · ');
  return full || 'AlexandrAI Report';
}

export function prepareHtmlForPublish(html, format = {}) {
  const title = deriveBrowserTitle(extractReportData(html), format);
  const script = `<script id="alexandrai-browser-title">document.title = ${JSON.stringify(title)};</script>`;
  const withTitle = HTML_TITLE_RE.test(html)
    ? html.replace(HTML_TITLE_RE, `$1${escapeHtml(title)}$3`)
    : html.replace(/<head\b[^>]*>/i, (match) => `${match}\n<title>${escapeHtml(title)}</title>`);
  const withoutPriorFinalizer = withTitle.replace(BROWSER_TITLE_SCRIPT_RE, '\n');

  if (/<\/body>/i.test(withoutPriorFinalizer)) {
    return withoutPriorFinalizer.replace(/\s*<\/body>/i, `\n${script}\n</body>`);
  }
  return `${withoutPriorFinalizer}\n${script}\n`;
}

function parseJsonScript(source, label) {
  try {
    return JSON.parse(source.trim());
  } catch (cause) {
    throw new Error(`Could not parse ${label} JSON: ${cause?.message || String(cause)}`);
  }
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function firstTitlePart(...values) {
  for (const value of values) {
    const cleaned = cleanTitlePart(value);
    if (cleaned) return cleaned;
  }
  return '';
}

function cleanTitlePart(value) {
  const text = String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\{\{[^}]+\}\}/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s\-–—·:|/]+|[\s\-–—·:|/]+$/g, '')
    .trim();
  return text === '{{}}' ? '' : text;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  })[char]);
}
