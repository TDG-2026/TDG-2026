import 'server-only';
import {getSupabaseAdmin} from '@/lib/supabase/server';

const PAGE = 1000;

// Same rows as /api/gds-commands: published only, ordered by id.
// Returns [] on any error, so the page still builds and the browser
// falls back to loading entries itself.
export async function getPublishedCommands() {
  try {
    const supabase = getSupabaseAdmin();
    const rows = [];

    for (let from = 0; ; from += PAGE) {
      const {data, error} = await supabase
        .from('gds_commands')
        .select('id, category, topic, travelport, amadeus, sabre, keywords')
        .eq('review_status', 'published')
        .order('id', {ascending: true})
        .range(from, from + PAGE - 1);

      if (error) throw new Error(error.message);

      rows.push(...(data || []));
      if (!data || data.length < PAGE) break;
    }

    return rows;
  } catch (error) {
    console.error('GDS server fetch failed:', error.message);
    return [];
  }
}

// Groups rows by category, keeping the order categories first appear in.
export function groupByCategory(rows) {
  const groups = new Map();

  for (const row of rows) {
    const key = row.category || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  return [...groups].map(([category, items]) => ({category, items}));
}