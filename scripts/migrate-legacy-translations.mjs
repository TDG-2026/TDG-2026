import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const sourcePath = path.join(root, 'messages/source.json');
const legacyDir = path.join(root, 'messages/legacy');
const locales = ['nl', 'de', 'fr', 'it', 'es', 'ps', 'ar', 'ur'];
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const sourceByHash = new Map();

for (const [key, item] of Object.entries(source)) {
  if (item?.retired === true) continue;
  if (typeof item?.text !== 'string' || typeof item?.hash !== 'string') {
    throw new Error(`Invalid source record: ${key}`);
  }
  const expected = crypto.createHash('sha256').update(item.text, 'utf8').digest('hex');
  if (expected !== item.hash) throw new Error(`Source hash mismatch: ${key}`);
  if (sourceByHash.has(item.hash)) throw new Error(`Duplicate source hash: ${item.hash}`);
  sourceByHash.set(item.hash, {key, item});
}

const tokenPattern = /\{\{?\s*[\w.-]+\s*\}?\}|%[sdif]|`[^`]+`/g;
const report = [];

for (const locale of locales) {
  const legacyPath = path.join(legacyDir, `${locale}.json`);
  const outputPath = path.join(root, 'messages', `${locale}.json`);
  const legacy = fs.existsSync(legacyPath)
    ? JSON.parse(fs.readFileSync(legacyPath, 'utf8'))
    : {messages: {}};
  const migrated = {};
  const conflicts = [];
  const invalid = [];
  const usedHashes = new Set();

  for (const [legacyKey, entry] of Object.entries(legacy.messages || {})) {
    const match = sourceByHash.get(entry?.sourceHash);
    if (!match) continue;
    const {key, item} = match;
    if (usedHashes.has(entry.sourceHash)) {
      conflicts.push({legacyKey, currentKey: key});
      continue;
    }
    if (typeof entry.text !== 'string' || !entry.text.trim()) {
      invalid.push({legacyKey, currentKey: key, reason: 'empty translation'});
      continue;
    }

    const sourceTokens = [...(item.text.match(tokenPattern) || [])].sort();
    const translatedTokens = [...(entry.text.match(tokenPattern) || [])].sort();
    if (JSON.stringify(sourceTokens) !== JSON.stringify(translatedTokens)) {
      invalid.push({legacyKey, currentKey: key, reason: 'placeholder mismatch'});
      continue;
    }

    usedHashes.add(entry.sourceHash);
    migrated[key] = {
      text: entry.text,
      sourceHash: item.hash,
      status: 'machine-translated',
      origin: entry.origin || 'Recovered from legacy catalog by exact English source-hash match; not human-reviewed',
      migration: {
        method: 'sha256-source-text-match',
        legacyKey,
      },
    };
  }

  const total = sourceByHash.size;
  const translated = Object.keys(migrated).length;
  const missing = total - translated;
  const catalog = {
    locale,
    status: 'draft',
    migration: {
      method: 'sha256-source-text-match',
      sourceMessages: total,
      migratedMessages: translated,
      missingMessages: missing,
      humanReviewed: false,
    },
    messages: migrated,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  report.push({locale, total, migrated: translated, missing, conflicts: conflicts.length, invalid: invalid.length});
  if (conflicts.length || invalid.length) {
    throw new Error(`${locale}: ${conflicts.length} hash conflicts, ${invalid.length} invalid entries`);
  }
}

console.table(report);
const reportPath = path.join(root, 'messages', 'migration-report.json');
fs.writeFileSync(reportPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  method: 'sha256-source-text-match',
  note: 'Machine-translated content is not human-reviewed and all non-English catalogs remain draft/noindex.',
  locales: report,
}, null, 2)}\n`, 'utf8');
