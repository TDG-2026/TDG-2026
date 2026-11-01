import {site} from '@/data/site';
import {resources} from '@/data/resources';
import {faqs} from '@/data/faqs';
import {answers} from '@/data/answers';
import {tourScreens} from '@/data/screens';
export const dynamic = 'force-static';
export function GET() {
  const b = site.url;
  const body = [`# Travel Genie — full reference\nSource: ${b}/en · Updated 2026-10-30\n`,
    '## Quick answers', ...answers.map((a) => `### ${a.q}\n${a.a}\nMore: ${b}/en${a.link.href}\n`),
    '## Frequently asked questions', ...faqs.map(([q, a]) => `### ${q}\n${a}\n`),
    '## Magic Toolbar tools', ...tourScreens.map((s) => `### ${s.title}\n${s.short}\n${s.points.map((p) => '- ' + p).join('\n')}${s.note ? '\nNote: ' + s.note : ''}\n`),
    '## Guides', ...resources.map((r) => `### ${r.title}\nURL: ${b}/en/resources/${r.slug}\n${r.description}\n\n${r.sections.map(([q, a]) => `#### ${q}\n${a}`).join('\n\n')}\n`),
  ].join('\n');
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600'}});
}