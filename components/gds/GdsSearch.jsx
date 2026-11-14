
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GdsSearch.module.css';
import { fields } from './seed';
import { loadGdsCommands } from './loadGdsCommands.mjs';

const finalSearchPlaceholder =
  'Search all GDS entries ... e.g. decode city, amadeus hotel, reservation, ticket issuance commands.';

const typingExample =
  'Search GDS commands... decode city, amadeus hotel, reservation, ticket issuance';

const norm = v =>
  String(v ?? '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();

export default function GdsSearch() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [system, setSystem] = useState('');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
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
    const controller = new AbortController();
    setLoaded(false);
    setMessage('');
    setEntries([]);
    loadGdsCommands(fetch, controller.signal)
      .then(rows => {
        if (controller.signal.aborted) return;
        setEntries(rows);
        setLoaded(true);
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        setMessage('Unable to load GDS entries. Please retry.');
        setLoaded(true);
      });
    return () => controller.abort();
  }, [refresh]);

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
              {!loaded ? 'Loading…' : `${filtered.length} results`}
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

          <button type="button" disabled={!loaded} onClick={() => setRefresh(v => v + 1)}>
            Refresh entries
          </button>
        </div>
        {message && <p role="alert">{message}</p>}

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

            <h2>{!loaded ? 'Loading GDS entries…' : message ? 'Entries unavailable' : entries.length ? 'No matching entries' : 'No published entries yet'}</h2>
            <p>{!loaded ? 'Please wait.' : message ? 'Use Refresh entries to try again.' : entries.length ? 'Try a different search or reset the filters.' : 'New entries appear here once published.'}</p>
            {loaded && entries.length > 0 && <button type="button" onClick={clear}>Clear filters</button>}
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
