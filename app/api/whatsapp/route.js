import crypto from 'node:crypto';
import { reply, chipLabel, MAIN_CHIPS, resolveChatLocale, t } from '@/lib/genie/engine';
import { getTranslator } from '@/lib/i18n/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN, WHATSAPP_APP_SECRET } = process.env;
const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v21.0'; // set to the current version shown in Meta's dashboard
const enabled = () => Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_VERIFY_TOKEN && WHATSAPP_APP_SECRET);

const seen = new Map();
function remember(id) {
  if (!id || seen.has(id)) return true;
  seen.set(id, Date.now());
  if (seen.size > 500) seen.delete(seen.keys().next().value);
  return false;
}

// Last language per customer (phone number). Best effort: kept while the server instance is warm.
const prefs = new Map();
function rememberLocale(phone, locale) {
  if (!phone || !locale) return;
  prefs.delete(phone);
  prefs.set(phone, locale);
  if (prefs.size > 5000) prefs.delete(prefs.keys().next().value);
}

// Website translation catalog for this language; plain English if it can't be loaded.
async function translatorFor(locale) {
  try { return await getTranslator(locale); } catch { return (s) => s; }
}

function validSignature(raw, header) {
  if (!header?.startsWith('sha256=')) return false;
  const expected = Buffer.from(crypto.createHmac('sha256', WHATSAPP_APP_SECRET).update(raw).digest('hex'));
  const received = Buffer.from(header.slice(7));
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

function format(ans, locale, localize) {
  let body = ans.text.replace(/\*\*([^*]+)\*\*/g, '*$1*');
  if (locale !== 'en' && ans.lang && ans.lang !== locale) body = `_${t(locale, localize).enNotice}_\n\n${body}`;
  if (ans.code) body += `\n\n${ans.code.map((c) => `${c.label}:\n\`\`\`${c.value}\`\`\``).join('\n')}${ans.codeNote ? `\n_${ans.codeNote}_` : ''}`;
  body += `\n\n${MAIN_CHIPS.map((id) => chipLabel(id, locale, localize)).join(' · ')}`;
  return body.slice(0, 4000);
}

async function send(to, body) {
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body, preview_url: false } }),
  });
  if (!res.ok) console.error('[genie] WhatsApp send failed', res.status, await res.text().catch(() => ''));
}

export async function GET(req) {
  if (!enabled()) return new Response('Not configured', { status: 404 });
  const p = new URL(req.url).searchParams;
  if (p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') === WHATSAPP_VERIFY_TOKEN) {
    return new Response(p.get('hub.challenge') ?? '', { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(req) {
  if (!enabled()) return new Response('Not configured', { status: 404 });
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get('x-hub-signature-256'))) return new Response('Invalid signature', { status: 401 });
  let payload;
  try { payload = JSON.parse(raw); } catch { return new Response('Bad JSON', { status: 400 }); }

  const jobs = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const msg of change.value?.messages ?? []) {
        if (msg.type !== 'text' || !msg.text?.body || remember(msg.id)) continue;
        const { locale, source } = resolveChatLocale({ text: msg.text.body, phone: msg.from, remembered: prefs.get(msg.from) });
        if (source === 'command' || source === 'message') rememberLocale(msg.from, locale);
        const localize = await translatorFor(locale);
        if (source === 'command') { jobs.push(send(msg.from, t(locale, localize).greeting)); continue; }
        const ans = reply(msg.text.body, locale, localize);
        if (ans.intent === 'fallback' || ans.webOnly) continue; // left for a human teammate
        jobs.push(send(msg.from, format(ans, locale, localize)));
      }
    }
  }
  await Promise.allSettled(jobs);
  return new Response('OK');
}