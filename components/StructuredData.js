
export default function StructuredData({ data }) {
  if (!data) return null;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': (Array.isArray(data) ? data : [data]).filter(Boolean),
  };

  if (graph['@graph'].length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
    />
  );
}
