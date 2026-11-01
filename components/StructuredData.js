export default function StructuredData({data}) {
  const graph = {'@context': 'https://schema.org', '@graph': (Array.isArray(data) ? data : [data]).filter(Boolean)};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(graph).replace(/</g, '\\u003c')}} />;
}