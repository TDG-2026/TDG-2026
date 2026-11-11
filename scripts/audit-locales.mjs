import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, 'messages/source.json'), 'utf8'));
const locales = ['nl', 'de', 'fr', 'it', 'es', 'ps', 'ar', 'ur'];
const activeKeys = Object.keys(source).filter((key) => source[key]?.retired !== true);
let incomplete = 0;

for (const locale of locales) {
  const file = path.join(root, 'messages', `${locale}.json`);
  const catalog = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : {messages: {}};
  let valid = 0;
  for (const key of activeKeys) {
    const item = catalog.messages?.[key];
    if (item?.text?.trim() && item.sourceHash === source[key].hash) valid += 1;
  }
  const missing = activeKeys.length - valid;
  const coverage = activeKeys.length ? (valid / activeKeys.length) * 100 : 100;
  console.log(`${locale}: ${valid}/${activeKeys.length} current source messages (${coverage.toFixed(1)}%); ${missing} missing/stale`);
  if (missing) incomplete += 1;
  if (catalog.status === 'published' && (missing || Object.values(catalog.messages || {}).some((m) => !['reviewed', 'published'].includes(m.status) || m.review?.sourceHash !== m.sourceHash))) {
    console.error(`ERROR: ${locale} is marked published without complete human-reviewed translations.`);
    process.exitCode = 1;
  }
}
if (incomplete) {
  console.log(`\n${incomplete} locale(s) remain incomplete. Keep them draft/noindex until all strings are translated and reviewed.`);
} else {
  console.log('\nAll locale catalogs have complete current-source coverage; human review is still required before publication.');
}
if (incomplete) process.exitCode = 1;
