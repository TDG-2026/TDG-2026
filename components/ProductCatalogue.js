'use client';

import {L,useI18n} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import {normalize} from '@/lib/i18n/config';
import StatusBadge from './StatusBadge';

const STORAGE_KEY = 'tg-product-order-v1';

export default function ProductCatalogue({ products, categories }) {
 const {t:tr}=useI18n();
  const defaultOrder = useMemo(() => products.map((p) => p.id), [products]);
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const [order, setOrder] = useState(defaultOrder);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [message, setMessage] = useState('');
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  // Restore a saved order, keeping only IDs that still exist.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) {
        const valid = [...new Set(saved.filter((id) => typeof id === 'string' && byId[id]))];
        const missing = defaultOrder.filter((id) => !valid.includes(id));
        setOrder([...valid, ...missing]);
      }
    } catch { /* ignore corrupt storage */ }
    setLoaded(true);
  }, [byId, defaultOrder]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(order)); } catch { /* storage unavailable */ }
  }, [order, loaded]);

  const q = normalize(query);
  const visible = order
    .map((id) => byId[id])
    .filter(Boolean)
    .filter((p) => category === 'All' || p.category === category)
    .filter((p) => !q || normalize([p.name, p.summary, p.category, tr(p.name),tr(p.summary),tr(p.category), ...(p.keywords || [])].join(' ')).includes(q));

  const isCustom = order.some((id, i) => id !== defaultOrder[i]);
  const filterOptions = ['All', ...categories];

  function move(id, dir) {
    const ids = visible.map((p) => p.id);
    const from = ids.indexOf(id);
    const to = from + dir;
    if (to < 0 || to >= ids.length) return;
    const target = ids[to];
    setOrder((prev) => {
      const next = [...prev];
      const a = next.indexOf(id);
      const b = next.indexOf(target);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setMessage(tr('{product} moved to position {position} of {total}.',{product:byId[id].name,position:to+1,total:ids.length}));
    requestAnimationFrame(() => document.getElementById(`move-${dir < 0 ? 'up' : 'down'}-${id}`)?.focus());
  }

  function dropOn(targetId) {
    if (!dragId || dragId === targetId) return;
    setOrder((prev) => {
      const next = prev.filter((id) => id !== dragId);
      next.splice(next.indexOf(targetId), 0, dragId);
      return next;
    });
    setMessage(tr('{product} moved.',{product:byId[dragId].name}));
    setDragId(null);
    setOverId(null);
  }

  function reset() {
    setOrder(defaultOrder);
    setMessage('Product order reset to the default.');
  }

  return (
    <L as="section" id="products" className="section section--soft" aria-labelledby="catalogue-title">
      <L as="div" className="container">
        <L as="div" className="section-head">
          <L as="p" className="eyebrow">More Products</L>
          <L as="h2" id="catalogue-title" className="title">More tools from <L as="span" className="grad">Travel Genie</L></L>
          <L as="p" className="lead">Separate applications, each with its own page, release details and terms. Not included with Magic Toolbar.</L>
        </L>

        <L as="div" className="cat-bar">
          <L as="div" className="search">
            <L as="label" htmlFor="product-search" className="sr-only">Search products</L>
            <Icon name="search" />
            <L as="input"
              id="product-search" type="search" placeholder="Search products, e.g. proposal, WhatsApp, report"
              value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off"
            />
          </L>
          <L as="div" className="chips" role="group" aria-label="Filter by category">
            {filterOptions.map((c) => (
              <L as="button" key={c} type="button" className="filter" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</L>
            ))}
          </L>
        </L>

        <L as="div" className="cat-meta">
          <L as="p">{visible.length} {visible.length === 1 ? 'product' : 'products'} · Arrange cards your way. The order is saved only in this browser.</L>
          <L as="button" type="button" className="btn btn--sm btn--ghost" onClick={reset} disabled={!isCustom}>
            <Icon name="reset" size={16} />Reset order
          </L>
        </L>

        <L as="p" className="sr-only" aria-live="polite">{message}</L>

        {visible.length === 0 ? (
          <L as="div" className="empty">
            <L as="p">{tr('No products match “{query}”.',{query})}</L>
            <L as="button" type="button" className="btn btn--ghost btn--sm" onClick={() => { setQuery(''); setCategory('All'); }}>Clear search</L>
          </L>
        ) : (
          <L as="ul" className="grid-products">
            {visible.map((p, i) => {
              const soon = p.status === 'soon';
              return (
                <L as="li"
                  key={p.id}
                  className={`pcard${soon ? ' pcard--soon' : ''}${dragId === p.id ? ' is-dragging' : ''}${overId === p.id && dragId !== p.id ? ' is-over' : ''}`}
                  draggable
                  onDragStart={(e) => { setDragId(p.id); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { e.preventDefault(); setOverId(p.id); }}
                  onDragLeave={() => setOverId((o) => (o === p.id ? null : o))}
                  onDrop={(e) => { e.preventDefault(); dropOn(p.id); }}
                  onDragEnd={() => { setDragId(null); setOverId(null); }}
                >
                  <L as="div" className="pcard-top">
                    <L as="span" className={`ptile tone-${p.tone}`} aria-hidden="true">{p.tile}</L>
                    <StatusBadge status={p.status} />
                  </L>
                  <L as="h3" id={`product-${p.id}`}>{p.name}</L>
                  <L as="p" className="by">by Travel Genie · {p.category}</L>
                  <L as="p" className="pcard-summary">{p.summary}</L>
                  <L as="div" className="pcard-foot">
                    {soon ? (
                      <L as="span" className="muted-text">In preparation</L>
                    ) : (
                      <Link href={p.path || `/products/${p.slug}`} className="pcard-link">
                        View details<L as="span" className="sr-only"> about {p.name}</L> <Icon name="arrowRight" size={16} />
                      </Link>
                    )}
                    <L as="div" className="order-btns">
                      <L as="button" id={`move-up-${p.id}`} type="button" className="icon-btn" onClick={() => move(p.id, -1)} disabled={i === 0} aria-label={tr('Move {product} earlier',{product:p.name})}>
                        <Icon name="up" size={16} />
                      </L>
                      <L as="button" id={`move-down-${p.id}`} type="button" className="icon-btn" onClick={() => move(p.id, 1)} disabled={i === visible.length - 1} aria-label={tr('Move {product} later',{product:p.name})}>
                        <Icon name="down" size={16} />
                      </L>
                    </L>
                  </L>
                </L>
              );
            })}
          </L>
        )}
      </L>
    </L>
  );
}