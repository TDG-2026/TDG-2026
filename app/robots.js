import {site} from '@/data/site';
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'Amazonbot', 'meta-externalagent', 'MistralAI-User', 'CCBot'];
// Unpublished pages use page-level noindex instead of crawl blocks, so crawlers can see it.
export default function robots() {
  return {rules: [{userAgent: '*', allow: '/', disallow: ['/api/']}, {userAgent: AI_BOTS, allow: '/', disallow: ['/api/']}],
    sitemap: `${site.url}/sitemap.xml`, host: site.url};
}