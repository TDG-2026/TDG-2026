// Travel Genie — automatic translation with automated QA.
// Azure Translator v3 is preferred; self-hosted LibreTranslate is the fallback.
// Usage: node scripts/i18n-auto.mjs [all|<locale-codes...>] [--tier=1] [--force] [--upgrade] [--status-only]

import {readFile, writeFile, rename} from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {localeRegistry} from '../lib/i18n/locales.registry.js';

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;

  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

    if (match && process.env[match[1]] === undefined) {      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

const ROOT = process.cwd();
const MSG = path.join(ROOT, 'messages');
const argv = process.argv.slice(2);

const has = flag => argv.includes(`--${flag}`);

const argValue = (flag, fallback) => {
  const arg = argv.find(item => item.startsWith(`--${flag}=`));
  return arg ? arg.slice(flag.length + 3) : fallback;
};

const STATUS_ONLY = has('status-only');
const FORCE = has('force');
const UPGRADE = has('upgrade');

const TIER = Number(argValue('tier', 99));
const MAX_FAIL = Number(argValue('max-fail', 0.02));

const MIN_AVAILABLE = Number(
  process.env.I18N_AVAILABLE_MIN ?? argValue('min-available', 0.9)
);

const requestedLocales = argv.filter(
  arg => !arg.startsWith('--') && arg !== 'all'
);

const KEY = process.env.AZURE_TRANSLATOR_KEY;
const REGION = process.env.AZURE_TRANSLATOR_REGION;

const ENDPOINT = (
  process.env.AZURE_TRANSLATOR_ENDPOINT ||
  'https://api.cognitive.microsofttranslator.com'
).replace(/\/+$/, '');

const LIBRE_URL = (
  process.env.LIBRETRANSLATE_URL || ''
).replace(/\/+$/, '');

const LIBRE_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

const GOOD = new Set(['reviewed', 'published', 'qa-passed']);

const AZURE_ORIGIN = 'Azure Translator (machine) + automated QA';

const LIBRE_ORIGIN = 'LibreTranslate (self-hosted machine) + automated QA';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// --------------------------------------------------
// CONFIGURATION VALIDATION
// --------------------------------------------------

if (!Number.isFinite(TIER) || TIER < 0) {
  throw new Error('--tier must be a non-negative number.');
}

if (!Number.isFinite(MAX_FAIL) || MAX_FAIL < 0 || MAX_FAIL > 1) {
  throw new Error('--max-fail must be between 0 and 1.');
}

if (
  !Number.isFinite(MIN_AVAILABLE) ||
  MIN_AVAILABLE < 0 ||
  MIN_AVAILABLE > 1
) {
  throw new Error(
    'I18N_AVAILABLE_MIN / --min-available must be between 0 and 1.'
  );
}

if (KEY && !/^https:\/\//i.test(ENDPOINT)) {
  throw new Error('AZURE_TRANSLATOR_ENDPOINT must use HTTPS.');
}

if (!Array.isArray(localeRegistry) || !localeRegistry.length) {
  throw new Error('Locale registry is missing or empty.');
}

const knownCodes = new Set(
  localeRegistry.map(locale => locale.code)
);

const unknownCodes = requestedLocales.filter(
  code => !knownCodes.has(code)
);

if (unknownCodes.length) {
  throw new Error(
    `Unknown locale code(s): ${unknownCodes.join(', ')}`
  );
}

// --------------------------------------------------
// PROTECTED GLOSSARY
// --------------------------------------------------

const GLOSSARY = [
  'Travel Genie Magic Toolbar',
  'Travel Genie Translate',
  'Travel Genie',
  'Magic Toolbar',
  'Genie',

  'Amadeus',
  'Sabre',
  'Travelport+',
  'Travelport',
  'Galileo',
  'Worldspan',
  'Apollo',
  'Abacus',
  'GDS',

  'NAME',
  'DOCS',
  'CTCM',
  'CTCE',
  'SSR',
  'PNR',
  'MRZ',
  'OCR',
  'APIS',
  'IATA',

  'WhatsApp',
  'Windows 11',
  'Windows',
  'Zoom',
  'DPAPI',
  'NADRA',
  'Emirates',
  'Google',
  'USD',

  'F1–F12',
  'Shift+F1',
  'Ctrl + Shift + Z',
  'Ctrl+V',
  'COPY ALL',

  'JPEG',
  'PNG',
  'BMP',
  'PDF',
  'A4',
  'API',
  'B2B',
  'B2C',
  'CRM',

  '1A',
  '1G',
  '1S',
  '24/7',

  'Ctrl+Shift+Z',
  'Alt+A',
  'Alt+V',

  'Container Manager',
  'Visa Photo Fixer',

  'SRDOCS',
  'SSRDOCS',
  'SRCTCM',
  'SRCTCE',
  'SSRCTCM',
  'SSRCTCE',

  '3DOCS',
  '3CTCM',
  '3CTCE',
  '3INFT',

  'CTCR',
  'HK1',
  'SR',
  'SI',
  'CHD',
  'INF',
  'MI',
  'FI',

  'AN',
  'SS',
  'NM',
  'AP',
  'TK',
  'RF',
  'ER',
  'RT',
  'XE',
  'XI',
  'FXP',
  'FXX',
  'FQD',
  'DAC',
  'DAN',
  'DNA',
  'HE',
  'FQ',
  'FD',
  'WP',
  'WPRQ',

  '(..)',
  '(./)'
];

const escapeRegExp = text =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const glossaryPattern = [...new Set(GLOSSARY)]
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|');

// --------------------------------------------------
// PROTECTED TOKENS
// --------------------------------------------------

const PROTECT = new RegExp([
  '\\{[A-Za-z0-9_]+\\}',

  'https?://[^\\s<>"\']+',

  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}',

  '\\b[A-Z][A-Z0-9]*(?:[/.][A-Z0-9]+)+\\b',

  `(?<![\\p{L}\\p{N}])(?:${glossaryPattern})(?![\\p{L}\\p{N}])`,

  '(?<![\\p{L}\\p{N}./*@-])(?=[A-Z0-9./*@-]*[./*@-])(?=[A-Z0-9./*@-]*[A-Z0-9])[A-Z0-9./*@-]{2,}(?![\\p{L}\\p{N}])',

  '\\$\\d[\\d,.]*',

  '\\*\\*',

  '//'
].join('|'), 'gu');

const escapeHtml = text =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const unescapeHtml = text =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

// --------------------------------------------------
// PROTECT AND RESTORE CONTENT
// --------------------------------------------------

function protect(text) {
  let output = '';
  let last = 0;

  for (const match of text.matchAll(PROTECT)) {
    output += escapeHtml(
      text.slice(last, match.index)
    );

    output += `<span class="notranslate" translate="no">${escapeHtml(match[0])}</span>`;

    last = match.index + match[0].length;
  }

  return (
    output + escapeHtml(text.slice(last))
  ).replace(/\n/g, '<br/>');
}

function unprotect(html) {
  const withNewlines = html.replace(
    /<br\s*\/?>/gi,
    '\n'
  );

  const withTokens = withNewlines.replace(
    /<span[^>]*notranslate[^>]*>([\s\S]*?)<\/span>/gi,
    '$1'
  );

  return unescapeHtml(
    withTokens.replace(/<\/?[a-z][^>]*>/gi, '')
  )
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

// --------------------------------------------------
// AUTOMATED QUALITY ASSURANCE
// --------------------------------------------------

function qa(source, translated) {
  const issues = [];

  if (!translated || !translated.trim()) {
    issues.push('empty');
  }

  for (const match of source.matchAll(PROTECT)) {
    if (!translated.includes(match[0])) {
      issues.push(`missing protected token: ${match[0]}`);
    }
  }

  const plainSource = source.replace(PROTECT, '').trim();

  if (plainSource.length > 30 && translated.length) {
    const ratio = translated.length / source.length;

    if (ratio < 0.15 || ratio > 4) {
      issues.push(`length ratio ${ratio.toFixed(2)}`);
    }
  }

  if (
    (source.match(/\n/g) || []).length !==
    (translated.match(/\n/g) || []).length
  ) {
    issues.push('line breaks');
  }

  return [...new Set(issues)];
}

// --------------------------------------------------
// SAFE JSON OPERATIONS
// --------------------------------------------------

async function readJson(file, fallback) {
  try {
    return JSON.parse(
      await readFile(file, 'utf8')
    );
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;

    throw new Error(
      `Cannot read/parse ${path.relative(ROOT, file)}: ${error.message}`
    );
  }
}

async function writeJsonAtomic(file, data) {
  const temp = `${file}.tmp`;

  await writeFile(
    temp,
    JSON.stringify(data, null, 2) + '\n',
    'utf8'
  );

  await rename(temp, file);
}

// --------------------------------------------------
// AZURE TRANSLATOR
// --------------------------------------------------

async function azure(texts, target) {
  const url =
    `${ENDPOINT}/translate?api-version=3.0&from=en&to=${encodeURIComponent(target)}&textType=html`;

  for (let attempt = 1; attempt <= 6; attempt++) {
    let response;

    try {
      response = await fetch(url, {
        method: 'POST',

        signal: AbortSignal.timeout(60000),

        headers: {
          'Ocp-Apim-Subscription-Key': KEY,

          ...(REGION
            ? {'Ocp-Apim-Subscription-Region': REGION}
            : {}),

          'Content-Type': 'application/json; charset=UTF-8'
        },

        body: JSON.stringify(
          texts.map(Text => ({Text}))
        )
      });

    } catch (error) {
      if (attempt === 6) throw error;

      await sleep(2 ** attempt * 1000);
      continue;
    }

    if (response.ok) {
      const data = await response.json();

      if (
        !Array.isArray(data) ||
        data.length !== texts.length
      ) {
        throw new Error('Malformed Azure response.');
      }

      return data.map(
        item => item?.translations?.[0]?.text ?? ''
      );
    }

    if (
      response.status === 429 ||
      response.status >= 500
    ) {
      await sleep(
        (Number(response.headers.get('retry-after')) || 2 ** attempt) * 1000
      );

      continue;
    }

    throw new Error(
      `Azure ${response.status}: ${(await response.text()).slice(0, 300)}`
    );
  }

  throw new Error('Azure retries exhausted.');
}

// --------------------------------------------------
// LIBRETRANSLATE FALLBACK
// --------------------------------------------------

async function libreLanguageSet() {
  try {
    const response = await fetch(
      `${LIBRE_URL}/languages`,
      {signal: AbortSignal.timeout(10000)}
    );

    if (!response.ok) return null;

    return new Set(
      (await response.json()).map(item => item.code)
    );

  } catch {
    return null;
  }
}

function libreCodeFor(locale, available) {
  if (!available) return null;

  const candidates = [
    locale.mt,
    locale.code,
    locale.code.split('-')[0],

    locale.code === 'zh-Hans' ? 'zh' : null,
    locale.code === 'pt-BR' ? 'pt' : null
  ];

  return candidates.find(
    code => code && available.has(code)
  ) || null;
}

async function libre(texts, target) {
  const response = await fetch(
    `${LIBRE_URL}/translate`,
    {
      method: 'POST',

      signal: AbortSignal.timeout(300000),

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        q: texts,
        source: 'en',
        target,
        format: 'html',

        ...(LIBRE_KEY
          ? {api_key: LIBRE_KEY}
          : {})
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `LibreTranslate ${response.status}: ${(await response.text()).slice(0, 300)}`
    );
  }

  const data = await response.json();

  const output = Array.isArray(data.translatedText)
    ? data.translatedText
    : [data.translatedText];

  if (output.length !== texts.length) {
    throw new Error('Malformed LibreTranslate response.');
  }

  return output;
}

async function viaLibre(texts, target) {
  const output = [];

  for (let i = 0; i < texts.length; i += 20) {
    output.push(
      ...await libre(
        texts.slice(i, i + 20),
        target
      )
    );
  }

  return output;
}

// --------------------------------------------------
// BATCH MANAGEMENT
// --------------------------------------------------

function batches(items) {
  const output = [];

  let current = [];
  let size = 0;

  for (const item of items) {
    if (
      current.length &&
      (
        current.length >= 100 ||
        size + item.html.length > 40000
      )
    ) {
      output.push(current);

      current = [];
      size = 0;
    }

    current.push(item);
    size += item.html.length;
  }

  if (current.length) {
    output.push(current);
  }

  return output;
}

// --------------------------------------------------
// LOAD AND VALIDATE SOURCE CATALOG
// --------------------------------------------------

const source = await readJson(
  path.join(MSG, 'source.json'),
  null
);

if (
  !source ||
  typeof source !== 'object' ||
  Array.isArray(source)
) {
  throw new Error(
    'messages/source.json missing/invalid — run npm run i18n:extract first.'
  );
}

const keys = Object.keys(source).filter(
  key => source[key]?.retired !== true
);

if (!keys.length) {
  throw new Error(
    'messages/source.json is empty. Refusing to update locale files.'
  );
}

for (const key of keys) {
  if (
    typeof source[key]?.text !== 'string' ||
    typeof source[key]?.hash !== 'string'
  ) {
    throw new Error(
      `Invalid source message "${key}": expected text and hash.`
    );
  }
}

// --------------------------------------------------
// SELECT TARGET LOCALES
// --------------------------------------------------

const targets = new Set(
  localeRegistry
    .filter(locale =>
      locale.code !== 'en' &&
      locale.tier <= TIER &&
      (
        !requestedLocales.length ||
        requestedLocales.includes(locale.code)
      )
    )
    .map(locale => locale.code)
);

// --------------------------------------------------
// PROVIDER INITIALIZATION
// --------------------------------------------------

const libreSet =
  !STATUS_ONLY && LIBRE_URL
    ? await libreLanguageSet()
    : null;

let azureDown = !KEY;

if (!STATUS_ONLY) {
  if (LIBRE_URL && !libreSet) {
    console.warn(
      `LibreTranslate unreachable at ${LIBRE_URL}; fallback disabled.`
    );
  }

  if (!KEY && !libreSet) {
    console.warn(
      'No translation provider configured; existing translations will receive QA only.'
    );
  } else if (!KEY) {
    console.log(
      'AZURE_TRANSLATOR_KEY not set; using self-hosted LibreTranslate.'
    );
  }
}

// --------------------------------------------------
// MAIN TRANSLATION PROCESS
// --------------------------------------------------

const report = {
  generatedAt: new Date().toISOString(),
  totalMessages: keys.length,
  locales: {}
};

const available = ['en'];

for (
  const locale of localeRegistry.filter(
    item => item.code !== 'en'
  )
) {
  const file = path.join(
    MSG,
    `${locale.code}.json`
  );

  const catalog = await readJson(
    file,
    {
      locale: locale.code,
      status: 'draft',
      messages: {}
    }
  );

  catalog.locale = locale.code;
  catalog.messages ||= {};

  const active =
    !STATUS_ONLY &&
    targets.has(locale.code);

  if (active) {
    try {
      const libreCode = libreCodeFor(
        locale,
        libreSet
      );

      const todo = [];

      for (const key of keys) {
        const message = catalog.messages[key];

        const fresh = Boolean(
          message?.text &&
          message.sourceHash === source[key].hash
        );

        if (
          fresh &&
          ['reviewed', 'published'].includes(message.status) &&
          !FORCE
        ) {
          continue;
        }

        const upgrade =
          UPGRADE &&
          !azureDown &&
          fresh &&
          message.origin === LIBRE_ORIGIN;

        if (fresh && !FORCE && !upgrade) {
          if (message.status !== 'qa-passed') {
            const issues = qa(
              source[key].text,
              message.text
            );

            message.status = issues.length
              ? 'needs-review'
              : 'qa-passed';

            if (issues.length) {
              message.qa = issues;
            } else {
              delete message.qa;
            }
          }

          continue;
        }

// Never automatically overwrite human-reviewed translations,
// including when the English source text has changed.

if (
  message?.text &&
  ['reviewed', 'published'].includes(message.status) &&
  !fresh
) {
  message.sourceChanged = true;
  message.previousSourceHash = message.sourceHash;
  message.currentSourceHash = source[key].hash;

  continue;
}

        todo.push({
          key,
          html: protect(source[key].text)
        });
      }

      if (todo.length && azureDown && !libreCode) {
        console.warn(
          `[${locale.code}] skipped: no configured provider supports this language.`
        );

      } else if (todo.length) {
        let completed = 0;

        for (const group of batches(todo)) {
          let output = null;
          let origin = AZURE_ORIGIN;

          if (!azureDown) {
            try {
              if (!locale.mt) {
                throw new Error(
                  `No Azure language code configured for ${locale.code}.`
                );
              }

              output = await azure(
                group.map(item => item.html),
                locale.mt
              );

            } catch (error) {
              azureDown = true;

              if (!libreCode) {
                throw error;
              }

              console.warn(
                `\n[${locale.code}] Azure failed (${error.message.slice(0, 120)}); switching to LibreTranslate.`
              );
            }
          }

          if (!output) {
            output = await viaLibre(
              group.map(item => item.html),
              libreCode
            );

            origin = LIBRE_ORIGIN;
          }

          group.forEach((item, index) => {
            const text = unprotect(output[index]);

            const issues = qa(
              source[item.key].text,
              text
            );

            catalog.messages[item.key] = {
              text,
              sourceHash: source[item.key].hash,

              status: issues.length
                ? 'needs-review'
                : 'qa-passed',

              origin,
              translatedAt: new Date().toISOString(),

              ...(issues.length
                ? {qa: issues}
                : {})
            };
          });

          completed += group.length;

          await writeJsonAtomic(file, catalog);

          process.stdout.write(
            `\r[${locale.code}] ${completed}/${todo.length} (${origin === AZURE_ORIGIN ? 'Azure' : 'LibreTranslate'})   `
          );
        }

        process.stdout.write('\n');
      }

    } catch (error) {
      console.error(
        `\n[${locale.code}] failed: ${error.message}`
      );

      report.locales[locale.code] = {
        error: error.message
      };
    }
  }

  // ------------------------------------------------
  // COVERAGE AND QUALITY REPORT
  // ------------------------------------------------

  const valid = keys.filter(key =>
    catalog.messages[key]?.text &&
    catalog.messages[key].sourceHash === source[key].hash
  );

  const good = valid.filter(key =>
    GOOD.has(catalog.messages[key].status)
  ).length;

  const libreCount = valid.filter(key =>
    catalog.messages[key].origin === LIBRE_ORIGIN
  ).length;

  const coverage = valid.length / keys.length;

  if (
    active &&
    catalog.status !== 'published'
  ) {
    catalog.status =
      valid.length === keys.length &&
      (1 - good / keys.length) <= MAX_FAIL
        ? 'machine-published'
        : 'draft';

    await writeJsonAtomic(file, catalog);
  }

  if (coverage >= MIN_AVAILABLE) {
    available.push(locale.code);
  }

  report.locales[locale.code] = {
    ...report.locales[locale.code],

    coverage: Number(coverage.toFixed(4)),
    good,
    needsReview: valid.length - good,
    libre: libreCount,
    status: catalog.status
  };
}

// --------------------------------------------------
// WRITE OUTPUTS
// --------------------------------------------------

// Status-only mode must never modify files.

if (!STATUS_ONLY) {
  await writeFile(
    path.join(ROOT, 'lib/i18n/available.js'),

    `// Generated by scripts/i18n-auto.mjs. Locales with enough translated content for automatic negotiation.\nexport const availableLocales=${JSON.stringify(available)};\n`,

    'utf8'
  );

  await writeJsonAtomic(
    path.join(ROOT, 'I18N_AUTO_REPORT.json'),
    report
  );
}

console.log(
  `Available for auto-negotiation: ${available.length}/${localeRegistry.length} locales.`
);

if (STATUS_ONLY) {
  console.log(
    'Status-only mode: no files were changed.'
  );
}
