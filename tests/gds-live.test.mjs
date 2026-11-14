import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadGdsCommands } from '../components/gds/loadGdsCommands.mjs';

test('loads ID 15 and entries beyond the first 50 with no browser cache', async () => {
  const data = Array.from({ length: 121 }, (_, i) => ({ id: i + 1, topic: i === 14 ? 'Email' : 'City' }));
  const offsets = [];
  const rows = await loadGdsCommands(async (url, options) => {
    assert.equal(options.cache, 'no-store');
    const offset = Number(new URL(url, 'http://localhost').searchParams.get('offset'));
    offsets.push(offset);
    return { ok: true, json: async () => ({ commands: data.slice(offset, offset + 50) }) };
  });
  assert.deepEqual(offsets, [0, 50, 100]);
  assert.deepEqual(rows, data);
  assert.equal(rows.find(row => row.id === 15).topic, 'Email');
});
test('API failure is surfaced instead of silently showing preview data', async () => {
  await assert.rejects(loadGdsCommands(async () => ({ ok: false })), /request failed/);
  await assert.rejects(loadGdsCommands(async () => ({ ok: true, json: async () => ({}) })), /Invalid/);
});
test('route validates pagination, keeps publication filter, and disables response caching', async () => {
  const source = (await readFile(new URL('../app/api/gds-commands/route.js', import.meta.url), 'utf8'))
    .replace("import { NextResponse } from 'next/server';", 'const NextResponse = { json: (body, options) => ({body, ...options}) };')
    .replace("import { getSupabaseAdmin } from '@/lib/supabase/server';", 'const getSupabaseAdmin = () => globalThis.__gdsMock;');
  const calls = [];
  const query = { then(resolve) { resolve({ data: [{ id: 15, topic: 'Email' }], error: null }); } };
  for (const method of ['select','eq','order','range','or']) query[method] = (...args) => { calls.push([method, ...args]); return query; };
  globalThis.__gdsMock = { from: () => query };
  try {
    const { GET } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    const result = await GET({ url: 'http://localhost/api/gds-commands?limit=50&offset=50' });
    assert.deepEqual(calls.find(x => x[0] === 'range'), ['range', 50, 99]);
    assert.deepEqual(calls.find(x => x[0] === 'eq'), ['eq', 'review_status', 'published']);
    assert.equal(result.body.commands[0].id, 15);
    assert.equal(result.headers['Cache-Control'], 'no-store');
    for (const params of ['offset=-1', 'offset=abc', 'limit=51', 'offset=9007199254740991']) {
      assert.equal((await GET({ url: `http://localhost/api/gds-commands?${params}` })).status, 400);
    }
  } finally { delete globalThis.__gdsMock; }
});
