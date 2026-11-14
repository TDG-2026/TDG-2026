
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LIMIT = 50;

export async function GET(request) {
  const url = new URL(request.url);
  const search = (url.searchParams.get('q') || '').trim();
  const offsetText = url.searchParams.get('offset') || '0';
  const limitText = url.searchParams.get('limit') || '20';

  if (
    search.length > 100 ||
    !/^\d+$/.test(offsetText) ||
    !Number.isSafeInteger(Number(offsetText)) ||
    Number(offsetText) > Number.MAX_SAFE_INTEGER - MAX_LIMIT ||
    !/^\d+$/.test(limitText) ||
    Number(limitText) < 1 ||
    Number(limitText) > MAX_LIMIT
  ) {
    return NextResponse.json(
      { error: 'Invalid search parameters' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('gds_commands')
      .select('id, category, topic, travelport, amadeus, sabre, keywords')
      .eq('review_status', 'published')
      .order('id', { ascending: true })
      .range(Number(offsetText), Number(offsetText) + Number(limitText) - 1);

    if (search) {
      	const term = search
  	.replace(/[%_\\]/g, ' ')
  	.replace(/[(),."]/g, ' ')
  	.replace(/\s+/g, ' ')
  	.trim();

      if (!term) {
        return NextResponse.json(
          { commands: [], count: 0 },
          { headers: { 'Cache-Control': 'no-store' } }
        );
      }

      query = query.or(
        [
          `category.ilike.%${term}%`,
          `topic.ilike.%${term}%`,
          `keywords.ilike.%${term}%`,
          `travelport.ilike.%${term}%`,
          `amadeus.ilike.%${term}%`,
          `sabre.ilike.%${term}%`,
        ].join(',')
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('GDS database query failed:', error.message);

      return NextResponse.json(
        { error: 'Unable to retrieve GDS commands' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        commands: data || [],
        count: data?.length || 0,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('GDS API failed:', error.message);

    return NextResponse.json(
      { error: 'GDS service unavailable' },
      { status: 500 }
    );
  }
}
