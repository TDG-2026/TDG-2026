export const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();
const fill = (text, vars) => (vars ? text.replace(/\{([a-zA-Z0-9_]+)\}/g, (all, n) => (Object.hasOwn(vars, n) ? String(vars[n]) : all)) : text);
const keepEdges = (original, text) => (original.match(/^\s*/)[0]) + text.trim() + (original.match(/\s*$/)[0]);

// Compact client dictionary: { "normalized English text": "translation" }
export function createDictTranslator(dict = {}) {
  return function t(value, variables) {
    if (typeof value !== 'string') return value;
    const k = normalizeText(value);
    if (!Object.hasOwn(dict, k)) return fill(value, variables);
    return keepEdges(value, fill(dict[k], variables));
  };
}
// Server-side compatibility (metadata, server components)
export function createTranslator(source, messages = {}) {
  const dict = Object.create(null);
  for (const [key, entry] of Object.entries(source)) if (messages[key]?.text) dict[normalizeText(entry.text)] = messages[key].text;
  return createDictTranslator(dict);
}
export function translatedObject(value, t, localizeUrl) {
  if (Array.isArray(value)) return value.map((v) => translatedObject(v, t, localizeUrl));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k,
    ['name','description','headline','text','caption','alt'].includes(k) && typeof v === 'string' ? t(v)
    : ['url','item','mainEntityOfPage'].includes(k) && typeof v === 'string' ? localizeUrl(v)
    : translatedObject(v, t, localizeUrl)]));
  return value;
}