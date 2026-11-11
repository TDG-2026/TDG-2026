import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, 'messages/source.json'), 'utf8'));
const locales = ['nl', 'de', 'fr', 'it', 'es', 'ps', 'ar', 'ur'];

test('migrated locale entries use current source keys and exact current source hashes', () => {
  for (const locale of locales) {
    const catalog = JSON.parse(fs.readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'));
    assert.equal(catalog.locale, locale);
    assert.equal(catalog.status, 'draft', `${locale} must remain draft until human review`);
    for (const [key, message] of Object.entries(catalog.messages)) {
      assert.ok(source[key], `${locale}/${key} is not a current source key`);
      assert.equal(message.sourceHash, source[key].hash, `${locale}/${key} has stale source hash`);
      assert.equal(message.status, 'machine-translated');
      assert.ok(message.migration?.legacyKey, `${locale}/${key} lacks legacy mapping trace`);
    }
  }
});

test('migrated catalogs never claim human review or publication', () => {
  for (const locale of locales) {
    const catalog = JSON.parse(fs.readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'));
    assert.notEqual(catalog.status, 'published');
    assert.equal(catalog.migration.humanReviewed, false);
    for (const message of Object.values(catalog.messages)) {
      assert.equal(message.review, undefined);
      assert.equal(['reviewed', 'published'].includes(message.status), false);
    }
  }
});

test('legacy source catalogs are preserved for audit and rollback', () => {
  for (const locale of locales) {
    const file = path.join(root, 'messages', 'legacy', `${locale}.json`);
    assert.ok(fs.existsSync(file), `missing preserved legacy catalog for ${locale}`);
  }
});
