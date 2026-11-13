
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GdsSearch.module.css';
import { seed, fields } from './seed';

const key = 'tdg-gds-nextjs-preview-v1';

const finalSearchPlaceholder =
  'Search all GDS entries ... e.g. decode city, amadeus hotel, reservation, ticket issuance commands.';

const typingExample =
  'Search GDS commands... decode city, amadeus hotel, reservation, ticket issuance';

const norm = v =>
  String(v ?? '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();

const blank = () =>
  Object.fromEntries(fields.map(f => [f, '']));

function csvParse(text) {
  let rows = [], row = [], cell = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\r' || c === '\n') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += c;
    }
  }

  if (quoted) throw Error('Unclosed CSV quote');

  row.push(cell);
  if (row.some(Boolean)) rows.push(row);

  const header = rows.shift()?.map(norm) || [];
  const indexes = fields.map(f =>
    header.indexOf(f === 'keywords' ? 'search keywords' : f)
  );

  if (indexes[0] < 0 || indexes[1] < 0) {
    throw Error('Category and Topic headers required');
  }

  return rows.map((r, i) => {
    if (r.length !== header.length) {
      throw Error(`Invalid CSV columns at row ${i + 2}`);
    }

    return Object.fromEntries(
      fields.map((f, j) => [f, indexes[j] < 0 ? '' : r[indexes[j]]])
    );
  });
}

function exportFile(name, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const escapeCsv = v => {
  let s = String(v ?? '');
  if (/^[\s]*[=+@\-\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
};

export default function GdsSearch() {
  const [entries, setEntries] = useState(seed);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [system, setSystem] = useState('');
  const [page, setPage] = useState(1);
  const [admin, setAdmin] = useState(false);
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState(blank());
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState('');

  // Decorative placeholder animation only.
  // The actual search value is never modified.
  const [searchPlaceholder, setSearchPlaceholder] =
    useState(finalSearchPlaceholder);

  const searchInteracted = useRef(false);
  const typingTimers = useRef([]);

  const stopSearchTyping = () => {
    if (searchInteracted.current) return;

    searchInteracted.current = true;

    typingTimers.current.forEach(({ id, kind }) => {
      if (kind === 'interval') {
        window.clearInterval(id);
      } else {
        window.clearTimeout(id);
      }
    });

    typingTimers.current = [];
    setSearchPlaceholder(finalSearchPlaceholder);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timers = [];

    const addTimer = (id, kind) => {
      const timer = { id, kind };
      timers.push(timer);
      typingTimers.current.push(timer);
    };

    [5000, 10000, 15000].forEach((delay, cycle) => {
      const timeoutId = window.setTimeout(() => {
        if (searchInteracted.current) return;

        let index = 0;
        setSearchPlaceholder('');

        const intervalId = window.setInterval(() => {
          if (searchInteracted.current) {
            window.clearInterval(intervalId);
            return;
          }

          index += 1;
          setSearchPlaceholder(typingExample.slice(0, index));

          if (index >= typingExample.length) {
            window.clearInterval(intervalId);

            if (cycle === 2) {
              setSearchPlaceholder(finalSearchPlaceholder);
            }
          }
        }, 35);

        addTimer(intervalId, 'interval');
      }, delay);

      addTimer(timeoutId, 'timeout');
    });

    return () => {
      timers.forEach(({ id, kind }) => {
        if (kind === 'interval') {
          window.clearInterval(id);
        } else {
          window.clearTimeout(id);
        }
      });

      typingTimers.current = [];
    };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved)) setEntries(saved);
    } catch {}

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(key, JSON.stringify(entries));
    } catch {
      setMessage(
        'Browser storage is full; changes may not persist. Export your data.'
      );
    }
  }, [entries, loaded]);

  const categories = useMemo(
    () => [...new Set(entries.map(e => e.category).filter(Boolean))].sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    const terms = norm(query).split(' ').filter(Boolean);

    return entries.filter(e =>
      (!category || e.category === category) &&
      (!system || Boolean(e[system])) &&
      terms.every(t =>
        norm(fields.map(f => e[f]).join(' ')).includes(t)
      )
    );
  }, [entries, query, category, system]);

  const pages = Math.max(1, Math.ceil(filtered.length / 15));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const clear = () => {
    setQuery('');
    setCategory('');
    setSystem('');
    setPage(1);
  };

  const copy = async (e, s) => {
    try {
      await navigator.clipboard.writeText(e[s]);
      setCopied(`${e.id}:${s}`);
      setTimeout(() => setCopied(''), 1300);
    } catch {
      setMessage(
        'Clipboard unavailable. Use HTTPS or localhost for testing.'
      );
    }
  };

  const begin = e => {
    setDraft(
      e
        ? Object.fromEntries(fields.map(f => [f, e[f] || '']))
        : blank()
    );
    setEditor(e?.id || 'new');
    setMessage('');
  };

  const save = e => {
    e.preventDefault();

    if (
      !draft.category.trim() ||
      !draft.topic.trim() ||
      !['travelport', 'amadeus', 'sabre'].some(s => draft[s].trim())
    ) {
      setMessage(
        'Category, topic and at least one GDS command are required.'
      );
      return;
    }

    const dup = entries.find(x =>
      x.id !== editor &&
      norm(x.category) === norm(draft.category) &&
      norm(x.topic) === norm(draft.topic)
    );

    if (
      dup &&
      !window.confirm(
        'Possible duplicate category and topic. Save separately?'
      )
    ) return;

    setEntries(a =>
      editor === 'new'
        ? [{ ...draft, id: crypto.randomUUID() }, ...a]
        : a.map(x =>
            x.id === editor ? { ...x, ...draft } : x
          )
    );

    setEditor(null);
    setMessage('Saved in this browser (preview only).');
  };

  const remove = e => {
    if (window.confirm(`Remove ${e.category} / ${e.topic}?`)) {
      setEntries(a => a.filter(x => x.id !== e.id));
      setMessage('Entry removed from browser preview.');
    }
  };

  const exportData = format => {
    const data = entries.map(e =>
      Object.fromEntries(fields.map(f => [f, e[f] || '']))
    );

    if (format === 'json') {
      exportFile(
        'gds-entries.json',
        JSON.stringify(data, null, 2),
        'application/json'
      );
    } else {
      exportFile(
        'gds-entries.csv',
        '\uFEFF' +
          [
            fields
              .map(f => f === 'keywords' ? 'Search keywords' : f)
              .join(','),
            ...data.map(e =>
              fields.map(f => escapeCsv(e[f])).join(',')
            )
          ].join('\r\n'),
        'text/csv;charset=utf-8'
      );
    }
  };

  const importData = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      if (file.size > 5_000_000) {
        throw Error('Preview import maximum is 5 MB');
      }

      const text = await file.text();

      const rows = file.name.toLowerCase().endsWith('.json')
        ? JSON.parse(text)
        : csvParse(text);

      if (!Array.isArray(rows) || rows.length > 10000) {
        throw Error('Expected an array with no more than 10,000 rows');
      }

      const clean = rows.map((r, i) => {
        const e = Object.fromEntries(
          fields.map(f => [
            f,
            String(
              r[f] ??
              (f === 'keywords' ? r['Search keywords'] : '') ??
              ''
            )
          ])
        );

        if (
          !e.category.trim() ||
          !e.topic.trim() ||
          !['travelport', 'amadeus', 'sabre'].some(s => e[s].trim())
        ) {
          throw Error(`Invalid entry at row ${i + 1}`);
        }

        return e;
      });

      const known = new Set(
        entries.map(e =>
          norm(e.category) + '|' + norm(e.topic)
        )
      );

      const duplicates = clean.filter(e =>
        known.has(norm(e.category) + '|' + norm(e.topic))
      ).length;

      if (
        !window.confirm(
          `Import preview: ${clean.length} valid entries; ${duplicates} match existing category/topic pairs. Merge matching entries? Export a backup first.`
        )
      ) return;

      setEntries(previous => {
        const next = [...previous];

        for (const e of clean) {
          const idx = next.findIndex(x =>
            norm(x.category) === norm(e.category) &&
            norm(x.topic) === norm(e.topic)
          );

          if (idx >= 0) {
            next[idx] = { ...next[idx], ...e };
          } else {
            next.push({
              ...e,
              id: crypto.randomUUID()
            });
          }
        }

        return next;
      });

      setMessage(
        `Imported ${clean.length} rows into browser preview.`
      );
    } catch (err) {
      setMessage('Import failed: ' + err.message);
    }
  };

  return (
    <div className={styles.root}>
      <section
        className={styles.hero}
        aria-labelledby="gds-hero-title"
      >
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div className={styles.heroIntro}>
            <span className={styles.eyebrow}>
              GDS COMMAND REFERENCE &amp; COMPARISON
            </span>

            <div className={styles.heroTitleRow}>
              <div>
                <h1 id="gds-hero-title">
                  Travel Desk Genie All GDS Search Engine
                </h1>

                <p className={styles.heroSubtitle}>
                  Instant GDS Commands Discovery with All GDS Comparison
                </p>

                <p className={styles.heroSlogan}>
                  All GDS under one umbrella — with a little genie magic.
                </p>
              </div>

              <img
                className={styles.heroGenie}
                src="/images/tdg-gds-genie.png"
                alt="Travel Desk Genie mascot"
                width="112"
                height="112"
              />
            </div>

            <div className={styles.heroBenefits}>
              <span>Amadeus</span>
              <span>Travelport / Galileo</span>
              <span>Sabre</span>
            </div>
          </div>

          <aside
            className={styles.heroProduct}
            aria-label="Travel Genie Magic Toolbar Windows application"
          >
            <span className={styles.productEyebrow}>
              SMART AUTOMATION FOR TRAVEL PROFESSIONALS
            </span>

            <h2>Travel Genie Magic Toolbar</h2>

            <p className={styles.productTagline}>
              Thousands of Passport Entries. Minutes of Work. Pure Magic.
            </p>

            <p className={styles.productDescription}>
              Transform the way you work with GDS. Automatically prepare
              passenger <strong>NAME, DOCS, CTCM &amp; CTCE</strong> entries
              for <strong>all GDS</strong> with speed, precision, and
              effortless efficiency.
            </p>

            <div className={styles.heroActions} aria-label="Get the app or learn how to use it">
              <a
                className={styles.heroStoreButton}
                href="https://apps.microsoft.com/detail/9p1j21g2z9lz?hl=en-US&gl=PK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Travel Genie Magic Toolbar from Microsoft Store (opens in a new tab)"
              >
                <span className={styles.microsoftMark} aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
                <span className={styles.storeLabel}>
                  <small>GET IT FROM</small>
                  <strong>Microsoft Store</strong>
                </span>
                <span className={styles.storeArrow} aria-hidden="true">↗</span>
              </a>

              <a
                className={styles.heroYoutubeButton}
                href="https://www.youtube.com/channel/UCXcwiBG0ojtQK3M0UEZ8Lqw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Travel Desk Genie video tutorials and product training on YouTube (opens in a new tab)"
              >
                <span className={styles.youtubeIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" focusable="false">
                    <rect x="1.5" y="4" width="21" height="16" rx="5" fill="currentColor" />
                    <path d="M10 8.2L16.2 12 10 15.8V8.2Z" fill="white" />
                  </svg>
                </span>
                <span className={styles.youtubeLabel}>
                  <small>WATCH &amp; LEARN</small>
                  <strong>Video Tutorials</strong>
                </span>
                <span className={styles.youtubeArrow} aria-hidden="true">↗</span>
              </a>
            </div>

            <p className={styles.productFootnote}>
              Windows desktop app on Microsoft Store · Tutorials and product training on YouTube
            </p>
          </aside>
        </div>
      </section>

      {/* Premium embossed search and filters */}
      <div className={styles.sticky}>
        <div className={styles.wrap}>
          <label className={styles.search}>
            <img
              src="/images/tdg-gds-genie.png"
              alt=""
              width="39"
              height="39"
            />

            <input
              type="search"
              aria-label="Search GDS entries"
              placeholder={searchPlaceholder}
              value={query}
              onFocus={stopSearchTyping}
              onPointerDown={stopSearchTyping}
              onChange={e => {
                stopSearchTyping();
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <div className={styles.filters}>
            <label>
              Category
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All categories</option>
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              System
              <select
                value={system}
                onChange={e => {
                  setSystem(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All systems</option>
                {['travelport', 'amadeus', 'sabre'].map(s => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" onClick={clear}>
              Clear
            </button>

            <span
              aria-live="polite"
              className={styles.muted}
            >
              {filtered.length} results
            </span>
          </div>
        </div>
      </div>

      <main className={styles.wrap}>
        <div className={styles.heading}>
          <div>
            <h2>
              {query ? 'Search results' : 'Browse GDS entries'}
            </h2>
            <p className={styles.muted}>
              Copy reference commands individually. This tool does not
              execute GDS commands.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAdmin(v => !v)}
          >
            {admin ? 'Close admin preview' : 'Admin preview'}
          </button>
        </div>

        {admin && (
          <section className={styles.admin}>
            <h2>
              Entries manager{' '}
              <small>Local preview only</small>
            </h2>

            <p className={styles.muted}>
              Not authenticated or connected to a backend. Do not publish
              this admin view. Changes are stored only in this browser.
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => begin(null)}
              >
                + Add entry
              </button>

              <label className={styles.fileButton}>
                Import CSV / JSON
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={importData}
                  hidden
                />
              </label>

              <button
                type="button"
                onClick={() => exportData('csv')}
              >
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => exportData('json')}
              >
                Export JSON
              </button>
            </div>

            <p role="status">{message}</p>

            {editor && (
              <form onSubmit={save}>
                <h3>
                  {editor === 'new' ? 'Add' : 'Edit'} entry
                </h3>

                <div className={styles.formGrid}>
                  {fields.map(f => (
                    <label key={f}>
                      {f === 'keywords' ? 'Search keywords' : f}
                      <textarea
                        rows={
                          f === 'category' || f === 'topic'
                            ? 1
                            : 2
                        }
                        value={draft[f]}
                        onChange={e =>
                          setDraft(d => ({
                            ...d,
                            [f]: e.target.value
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>

                <div className={styles.actions}>
                  <button type="submit">
                    Save entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditor(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className={styles.adminList}>
              {entries.slice(0, 200).map(e => (
                <div
                  key={e.id}
                  className={styles.adminRow}
                >
                  <span>
                    <b>{e.category}</b> / {e.topic}
                  </span>

                  <div>
                    <button
                      type="button"
                      onClick={() => begin(e)}
                    >
                      Edit
                    </button>{' '}
                    <button
                      type="button"
                      onClick={() => remove(e)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {entries.length > 200 && (
              <p className={styles.muted}>
                Showing the first 200 entries in admin preview.
              </p>
            )}

            <details>
              <summary>
                Internal desktop toolbar shortcut reference
              </summary>
              <p>
                Windows Magic Toolbar only: Ctrl + Shift + G.
                Not a website keyboard shortcut.
              </p>
            </details>
          </section>
        )}

        {visible.length ? (
          <div className={styles.cards}>
            {visible.map(e => (
              <article
                key={e.id}
                className={styles.card}
              >
                <div className={styles.entryHeading}>
                  <span className={styles.pill}>
                    {e.category}
                  </span>
                  <h3>{e.topic}</h3>
                </div>

                <div className={styles.columns}>
                  {['travelport', 'amadeus', 'sabre'].map(s => (
                    <div
                      key={s}
                      className={`${styles.command} ${styles[s]}`}
                    >
                      <strong>
                        {s[0].toUpperCase() + s.slice(1)}
                      </strong>

                      <div className={styles.commandRow}>
                        <code>{e[s] || '—'}</code>
                        <button
                          type="button"
                          disabled={!e[s]}
                          aria-label={`Copy ${s} command for ${e.topic}`}
                          onClick={() => copy(e, s)}
                        >
                          {copied === `${e.id}:${s}`
                            ? 'Copied ✓'
                            : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {e.description && (
                  <p className={styles.muted}>
                    {e.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <img
              src="/images/tdg-gds-genie.png"
              alt=""
              width="72"
              height="72"
            />

            <h2>
              {entries.length
                ? 'No matching entries'
                : 'No entries yet'}
            </h2>

            <p>
              {entries.length
                ? 'Try a different search or reset the filters.'
                : 'Open the admin preview to add your first entry.'}
            </p>

            <button
              type="button"
              onClick={
                entries.length
                  ? clear
                  : () => setAdmin(true)
              }
            >
              {entries.length
                ? 'Clear filters'
                : 'Open admin preview'}
            </button>
          </div>
        )}

        {filtered.length > 15 && (
          <div className={styles.pagination}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {pages}
            </span>

            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}

        <section className={styles.reference}>
          <div>
            <h2>Compare at a glance</h2>
            <p>
              Travelport, Amadeus and Sabre side by side,
              with unavailable commands left blank.
            </p>
            <p className={styles.muted}>
              Time is money. Travel Desk Genie saves both.
            </p>
          </div>

          <img
            src="/images/tdg-gds-decode.webp"
            alt="Decode comparison showing Travelport, Amadeus and Sabre commands"
            width="560"
            height="290"
            loading="lazy"
          />
        </section>
      </main>
    </div>
  );
}
