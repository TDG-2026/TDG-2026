// Read every published page, rather than silently stopping at the API's 50-row limit.
export async function loadGdsCommands(fetcher, signal) {
  const rows = [];
  const limit = 50;
  for (let offset = 0; ; offset += limit) {
    const response = await fetcher(`/api/gds-commands?limit=${limit}&offset=${offset}`, {
      cache: 'no-store', signal,
    });
    if (!response.ok) throw new Error('GDS request failed');
    const body = await response.json();
    if (!Array.isArray(body.commands)) throw new Error('Invalid GDS response');
    rows.push(...body.commands);
    if (body.commands.length < limit) return rows;
  }
}
