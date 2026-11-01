import { locales } from '../data/genie/config.js';
import { strings } from '../data/genie/i18n.js';
import { intents, gdsEntries } from '../data/genie/knowledge.js';

const keys = Object.keys(strings.en);
const ids = new Set(intents.map((i) => i.id));
let errors = 0;
const rows = [];

for (const l of locales) {
  const cat = strings[l.code];
  const missing = cat ? keys.filter((k) => typeof cat[k] !== 'string' || !cat[k].trim()) : keys;
  const answered = intents.filter((i) => i.answer[l.code]).length;
  if (missing.length) { errors += 1; console.error(`✖ ${l.code}: missing UI keys → ${missing.join(', ')}`); }
  if (l.status === 'production' && answered < intents.length) {
    errors += 1; console.error(`✖ ${l.code}: marked production but ${intents.length - answered} answers are untranslated`);
  }
  rows.push({
    locale: l.code, status: l.status,
    ui: missing.length ? `${keys.length - missing.length}/${keys.length}` : 'complete',
    answers: `${answered}/${intents.length}`,
    productionReady: l.status === 'production' && !missing.length && answered === intents.length ? 'yes' : 'NO',
  });
}
for (const i of intents) {
  for (const f of i.followUps ?? []) if (!ids.has(f)) { errors += 1; console.error(`✖ intent ${i.id}: unknown follow-up "${f}"`); }
  if (i.entryType && !gdsEntries[i.entryType]) { errors += 1; console.error(`✖ intent ${i.id}: unknown entryType`); }
  if (!i.answer.en) { errors += 1; console.error(`✖ intent ${i.id}: missing English answer`); }
}
for (const code of Object.keys(strings)) if (!locales.some((l) => l.code === code)) console.warn(`! catalog "${code}" is not registered in config.js`);

console.table(rows);
if (errors) { console.error(`\nGenie check failed with ${errors} error(s).`); process.exit(1); }
console.log('\nGenie catalogs are structurally valid. Locales marked "NO" are not production-ready.');