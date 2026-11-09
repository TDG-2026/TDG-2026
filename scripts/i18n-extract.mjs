
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL, fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {parse} = require('next/dist/compiled/babel/parser');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputFile = path.join(root, 'messages/source.json');
const extraFile = path.join(root, 'messages/additional-source.json');

const prior = fs.existsSync(outputFile)
  ? JSON.parse(fs.readFileSync(outputFile, 'utf8'))
  : {};

if (!prior || typeof prior !== 'object' || Array.isArray(prior)) {
  throw new Error('messages/source.json must contain a JSON object.');
}

const oldKeys = new Map();
let sequence = Math.max(
  0,
  ...Object.keys(prior).map(k => Number(k.match(/m(\d+)$/)?.[1] || 0))
);

const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();

for (const [key, item] of Object.entries(prior)) {
  if (typeof item?.text === 'string') {
    oldKeys.set(normalize(item.text), key);
  }
}

const entries = {};

function sourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = path.join(dir, entry.name);

    return entry.isDirectory()
      ? sourceFiles(full)
      : (/\.(?:js|jsx|mjs)$/.test(entry.name) ? [full] : []);
  });
}

const excludedKeys = new Set([
  'id', 'slug', 'src', 'href', 'url', 'className', 'class', 'key',
  'type', 'value', 'code', 'icon', 'dir', 'lang', 'locale', 'locales',
  'keywords', 'keyword', 'intent', 'intents', 'match', 'matches',
  'pattern', 'patterns', 'trigger', 'triggers', 'synonyms', 'phrases',
  'aliases', 'terms', 'categoryId', 'followUps', 'releaseVersion',
  'date', 'dateTime', 'timestamp', 'regex', 'route', 'path',
  'examples', 'sampleInputs', 'trainingPhrases', 'utterances',
  'quickReplies', 'suggestions', 'tokens', 'normalized',
  'nativeName', 'languageName', 'localeName', 'languageCode',
  'countryCode', 'mt', 'tier'
]);

const schemaLabels = new Set([
  'FAQPage', 'Question', 'Answer', 'TechArticle', 'HowTo',
  'HowToStep', 'Breadcrumb', 'BreadcrumbList', 'ListItem',
  'WebSite', 'WebPage', 'Organization', 'AggregateRating',
  'ImageObject'
]);

function meaningful(value, allowShortLabel = false) {
  const text = String(value ?? '').trim();

  if (text.length < 2 || !/[A-Za-z]/.test(text)) return false;

  // Exclude structured-data schema labels.
  if (schemaLabels.has(text)) return false;

  // Exclude standalone timestamps.
  if (
    /^(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/i.test(text)
  ) return false;

  // Exclude URLs, paths and technical addresses.
  if (
    /^(?:https?:|mailto:|tel:|\/\S|#\S|@\S|\.[a-zA-Z/]|[A-Za-z]+:\/\/)/i.test(text)
  ) return false;

  if (/^\S+@\S+\.\S+$/.test(text)) return false;

  // Exclude source-code fragments.
  if (/^(?:import\s|export\s|use client$)/.test(text)) return false;

  if (
    /(?:=>|querySelector|\{\s*['"]|localStorage|\bfunction\b)/.test(text)
  ) return false;

  // Exclude standalone GDS command examples.
  if (
    /\b(?:SRDOCS|SSRDOCS|SRCTCM|SRCTCE|SI\.P1|3DOCS|3CTC)\b/.test(text)
  ) return false;

  // Exclude synthetic passenger-name and GDS name-entry examples.
  // These are technical sample data, not visitor-facing copy.
  if (
    !/[a-z]/.test(text) &&
    /^(?:(?:NM\d+|N\.|-[A-Z])[\s\S]*|[A-Z]+\/[A-Z]+\s+\(P\d+\))$/.test(text)
  ) return false;

  // Exclude opaque identifiers and technical labels.
  if (
    /^(?:[A-Z0-9_+ /.-]{2,}|[a-z][a-z0-9_-]*|\d+(?:\.\d+)?px)$/u.test(text)
    && !allowShortLabel
  ) return false;

  if (/^[A-Z0-9_.:/+-]{2,}$/.test(text) && !/[a-z]/.test(text)) {
    return false;
  }

  return true;
}

function add(
  value,
  file,
  line = 1,
  {allowShortLabel = false, normalizeWhitespace = false} = {}
) {
  const text = normalizeWhitespace
    ? normalize(value)
    : String(value ?? '').trim();

  if (!meaningful(text, allowShortLabel)) return;

  const normalized = normalize(text);

  const key = oldKeys.get(normalized) ||
    `${path.basename(file, path.extname(file)).replace(/[^a-zA-Z0-9]/g, '')}.m${String(++sequence).padStart(4, '0')}`;

  oldKeys.set(normalized, key);

  entries[key] ||= {
    text,
    hash: crypto.createHash('sha256').update(text, 'utf8').digest('hex'),
    sources: []
  };

  const relative = path.relative(root, file).split(path.sep).join('/');
  const source = `${relative}:${line}`;

  if (!entries[key].sources.includes(source)) {
    entries[key].sources.push(source);
  }
}

function isSplitJsxFragment(node, parent) {
  if (!Array.isArray(parent?.children)) return false;

  const index = parent.children.indexOf(node);
  if (index < 0) return false;

  const isInline = n =>
    n?.type === 'JSXElement' ||
    n?.type === 'JSXExpressionContainer';

  return (
    isInline(parent.children[index - 1]) ||
    isInline(parent.children[index + 1])
  );
}

function walk(node, parent, file, excludedAncestor = false) {
  if (!node || typeof node !== 'object') return;

  const prop = node.type === 'ObjectProperty'
    ? (node.key?.name ?? node.key?.value)
    : null;

  const excluded =
    excludedAncestor ||
    (node.type === 'ObjectProperty' && excludedKeys.has(String(prop)));

  if (!excluded) {
    if (node.type === 'JSXText') {
      add(node.value, file, node.loc?.start?.line ?? 1, {
        allowShortLabel: true,
        normalizeWhitespace: true
      });
    }

    if (node.type === 'StringLiteral') {
      const attr = parent?.type === 'JSXAttribute'
        ? parent.name?.name
        : null;

      const allowedAttr = [
        'alt',
        'title',
        'placeholder',
        'aria-label',
        'aria-description'
      ].includes(attr);

      const declaration = [
        'ImportDeclaration',
        'ExportNamedDeclaration',
        'ExportAllDeclaration',
        'DirectiveLiteral'
      ].includes(parent?.type);

      if ((!attr || allowedAttr) && !declaration) {
        add(node.value, file, node.loc?.start?.line ?? 1);
      }
    }

    if (
      node.type === 'TemplateLiteral' &&
      node.expressions.length === 0
    ) {
      add(
        node.quasis[0]?.value?.cooked,
        file,
        node.loc?.start?.line ?? 1
      );
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'comments') continue;

    if (Array.isArray(value)) {
      value.forEach(child => walk(child, node, file, excluded));
    } else if (value && typeof value === 'object') {
      walk(value, node, file, excluded);
    }
  }
}

const roots = [
  path.join(root, 'app/[locale]'),
  path.join(root, 'components'),
  path.join(root, 'data'),
  path.join(root, 'lib/genie')
];

const files = [
  ...new Set(roots.flatMap(sourceFiles)),
  path.join(root, 'lib/seo.js')
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  const relative = path.relative(root, file)
    .split(path.sep)
    .join('/');

  if (
    relative.endsWith('/locales.js') ||
    relative === 'data/genie/i18n.js' ||
    relative === 'data/genie/knowledge.js' ||
    relative === 'lib/seo.js'
  ) continue;

  const ast = parse(fs.readFileSync(file, 'utf8'), {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'dynamicImport', 'importMeta']
  });

  walk(ast, null, file);
}

// Keep chatbot interface strings.
// Do not scrape knowledge.js as a flat list because it contains
// matching phrases and intent metadata alongside answer content.

const genieI18n = path.join(root, 'data/genie/i18n.js');

if (fs.existsSync(genieI18n)) {
  const {strings: ui} = await import(
    pathToFileURL(genieI18n).href
  ).catch(() => ({}));

  function addUi(value, key = '') {
    if (typeof value === 'string') {
      if (!excludedKeys.has(key)) {
        add(value, genieI18n, 1, {allowShortLabel: true});
      }
    } else if (Array.isArray(value)) {
      value.forEach(item => addUi(item, key));
    } else if (value && typeof value === 'object') {
      for (const [childKey, childValue] of Object.entries(value)) {
        if (!excludedKeys.has(childKey)) {
          addUi(childValue, childKey);
        }
      }
    }
  }

  if (ui?.en) addUi(ui.en);
}

// Include computed legal, resource, product and site copy.
// Filter internal metadata fields.

for (const moduleName of ['legal', 'resources', 'products', 'site']) {
  const modulePath = path.join(root, 'data', `${moduleName}.js`);

  if (!fs.existsSync(modulePath)) continue;

  const mod = await import(pathToFileURL(modulePath).href);

  function visit(value, key = '') {
    if (typeof value === 'string') {
      if (!excludedKeys.has(key)) {
        if (
          moduleName === 'site' &&
          /^(english|arabic|chinese|french|german|hindi|indonesian|japanese|korean|portuguese|russian|spanish|thai|turkish|vietnamese)$/i.test(value.trim())
        ) return;

        add(value, modulePath, 1, {
          allowShortLabel: ['label', 'title', 'name'].includes(key)
        });
      }
    } else if (Array.isArray(value)) {
      value.forEach(item => visit(item, key));
    } else if (value && typeof value === 'object') {
      for (const [childKey, childValue] of Object.entries(value)) {
        if (!excludedKeys.has(childKey)) {
          visit(childValue, childKey);
        }
      }
    }
  }

  visit(mod);
}

// additional-source.json is a manually maintained allow-list
// containing visitor-facing copy only.

if (fs.existsSync(extraFile)) {
  const extra = JSON.parse(fs.readFileSync(extraFile, 'utf8'));

  if (
    !Array.isArray(extra) ||
    extra.some(item => typeof item !== 'string')
  ) {
    throw new Error(
      'messages/additional-source.json must be an array containing only strings.'
    );
  }

  for (const text of extra) {
    add(text, extraFile, 1, {allowShortLabel: true});
  }
}

// --------------------------------------------------
// PRESERVE HISTORICAL SOURCE MESSAGES
// --------------------------------------------------

// Existing messages missing from this extraction are retained.
// They are marked retired rather than deleted.
// If they reappear in a future extraction, they become active again.

for (const [key, oldEntry] of Object.entries(prior)) {
  if (!entries[key]) {
    entries[key] = {
      ...oldEntry,
      retired: true
    };
  } else {
    entries[key].retired = false;
  }
}
// Preserve historical source records that are no longer extracted.
// This prevents accidental deletion of existing translation IDs.
// Records absent from the current extraction are retained as retired.

for (const [key, previous] of Object.entries(prior)) {
  if (!entries[key]) {
    entries[key] = {
      ...previous,
      retired: true
    };
  }
}
fs.mkdirSync(path.dirname(outputFile), {recursive: true});

fs.writeFileSync(
  outputFile,
  JSON.stringify(entries, null, 2) + '\n',
  'utf8'
);

const messages = Object.fromEntries(
  Object.entries(entries).map(([key, item]) => [
    key,
    {
      text: item.text,
      sourceHash: item.hash,
      status: 'published'
    }
  ])
);

fs.writeFileSync(
  path.join(root, 'messages/en.json'),
  JSON.stringify({
    locale: 'en',
    status: 'published',
    messages
  }, null, 2) + '\n',
  'utf8'
);

console.log(`Extracted ${Object.keys(entries).length} source messages.`);
console.log('Schema labels, obvious timestamp fragments, matching metadata and locale metadata are excluded.');
console.log('Chatbot matching data is not bulk-extracted; dedicated chatbot UI strings remain included.');
