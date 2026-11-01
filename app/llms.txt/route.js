import {site} from '@/data/site';
import {resources} from '@/data/resources';
import {locales} from '@/lib/i18n/config';
import {getCatalog} from '@/lib/i18n/catalog';
export const dynamic = 'force-static';
export async function GET() {
  const b = site.url, live = [];
  for (const l of locales) if ((await getCatalog(l.code)).published) live.push(`- ${l.english} (${l.name}): ${b}/${l.code}`);
  const body = `# Travel Genie

> Travel Genie makes Windows productivity software for travel agencies. Its flagship product, Magic Toolbar, prepares passenger NAME, DOCS, CTCM and CTCE entries in Amadeus, Travelport and Sabre formats and adds desk tools: F1–F12 text shortcuts, reminders, phone directory, translation and visa photo checks. It does not issue tickets, search fares or connect to a GDS.

## Key facts
- Platform: Windows 11 (64-bit) desktop application
- Pricing (USD): $30/month, $220/year (saves $140), lifetime on request, 3-day trial
- Data: passport OCR runs locally; saved family records use Windows DPAPI; Translate sends selected text to an online service
- Support: ${site.supportEmail} · WhatsApp +${site.whatsappNumber}
- Specialist products are previews unless marked otherwise. Legal pages are draft templates.

## Main pages
- [Magic Toolbar](${b}/en/products/magic-toolbar)
- [Pricing](${b}/en/pricing)
- [Download](${b}/en/download)
- [User guide](${b}/en/guide)
- [Data handling](${b}/en/security-and-privacy)
- [Support](${b}/en/support)
- [All products](${b}/en/products)

## Guides
${resources.map((r) => `- [${r.title}](${b}/en/resources/${r.slug}): ${r.description}`).join('\n')}

## Full text
- [llms-full.txt](${b}/llms-full.txt): every FAQ and guide as plain text

## Published languages (${live.length} of ${locales.length})
${live.join('\n')}
`;
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600'}});
}