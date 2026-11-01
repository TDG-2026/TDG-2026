// scripts/check-answer-length.mjs  (NEW file)
const files = ["../data/faqs.js", "../data/answers.js"];
for (const f of files) {
  const mod = await import(new URL(f, import.meta.url));
  console.log(`\n== ${f}`);
  for (const val of Object.values(mod)) {
    if (!Array.isArray(val)) continue;
    for (const item of val) {
      const q = item.question ?? item.q ?? item.title;
      const a = item.answer ?? item.a ?? item.text;
      if (!q || typeof a !== "string") continue;
      const n = a.trim().split(/\s+/).length;
      console.log(`${n >= 40 && n <= 60 ? "OK " : "FIX"} ${String(n).padStart(3)}w  ${q}`);
    }
  }
}