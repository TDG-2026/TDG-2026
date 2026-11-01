// scripts/convert-images.mjs  (NEW file)
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";
async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name) && !/og|icon|favicon|apple/i.test(e.name)) {
      const out = p.replace(/\.(png|jpe?g)$/i, ".webp");
      await sharp(p).webp({ quality: 82 }).toFile(out);
      console.log("→", out);
    }
  }
}
await walk("public");