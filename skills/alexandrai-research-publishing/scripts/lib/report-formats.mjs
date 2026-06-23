import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const skillRoot = fileURLToPath(new URL('../../', import.meta.url));
export const formatsRoot = join(skillRoot, 'assets', 'report-formats');
export const legacyResearchTemplatePath = join(skillRoot, 'assets', 'research-paper-template.html');
export const registryPath = join(formatsRoot, 'registry.json');

export const REPORT_DATA_PATTERN =
  /(<script\b(?=[^>]*\bid=["']report-data["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>)[\s\S]*?(<\/script>)/i;
export const REPORT_DATA_SCRIPT_RE =
  /<script\b(?=[^>]*\bid=["']report-data["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/i;
export const ALEXANDRAI_METADATA_PATTERN =
  /(\s*)<script\b(?=[^>]*\bid=["']alexandrai-metadata["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>[\s\S]*?<\/script>(\s*)/i;
export const ALEXANDRAI_METADATA_SCRIPT_RE =
  /<script\b(?=[^>]*\bid=["']alexandrai-metadata["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/i;

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
  const values = [templateFingerprint(await readFormatTemplate(format))];
  if (format.id === 'research-paper') {
    values.push(templateFingerprint(await readFile(legacyResearchTemplatePath, 'utf8')));
  }
  return new Set(values);
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
