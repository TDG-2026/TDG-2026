import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import styles from './PdfDownloadCard.module.css';

// Reads the real file size at build time, so the label is always correct.
function fileSize(file) {
  try {
    const bytes = fs.statSync(path.join(process.cwd(), 'public', file)).size;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  } catch {
    return '';
  }
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 64 80" aria-hidden="true" focusable="false">
      <path
        d="M8 2h34l20 20v52a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M42 2v16a4 4 0 0 0 4 4h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect x="10" y="44" width="44" height="20" rx="4" fill="currentColor" />
      <text
        x="32"
        y="59"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

/**
 * variant:
 *  - "card"    large card (top of a guide)
 *  - "stacked" vertical card for grids (GDS Search Engine page)
 *  - "compact" one-line reminder (end of a guide)
 */
export default function PdfDownloadCard({
  pdf,
  variant = 'card',
  headingTag = 'h2',
  guideHref,
}) {
  if (!pdf) return null;

  const size = fileSize(pdf.file);
  const tone = styles[pdf.tone] || '';
  const Heading = headingTag;
  const id = `pdf-${pdf.tone}-${variant}`;

  if (variant === 'compact') {
    return (
      <aside className={`${styles.compact} ${tone}`} aria-label={pdf.title}>
        <span className={styles.compactIcon}>
          <PdfIcon />
        </span>
        <p className={styles.compactText}>
          <strong>Keep these notes offline.</strong> Download the free{' '}
          {pdf.title}
          {size ? ` (${size})` : ''}.
        </p>
        <a
          className={styles.primary}
          href={pdf.file}
          download
          type="application/pdf"
        >
          <span aria-hidden="true">↓</span> {pdf.label}
        </a>
      </aside>
    );
  }

  return (
    <aside
      className={`${styles.card} ${variant === 'stacked' ? styles.stacked : ''} ${tone}`}
      aria-labelledby={id}
    >
      <span className={styles.icon}>
        <PdfIcon />
      </span>

      <div className={styles.body}>
        <p className={styles.eyebrow}>Free download · {pdf.gds}</p>

        <Heading id={id} className={styles.title}>
          {pdf.title}
        </Heading>

        <p className={styles.blurb}>{pdf.blurb}</p>

        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={pdf.file}
            download
            type="application/pdf"
          >
            <span aria-hidden="true">↓</span> {pdf.label}
          </a>

          <a
            className={styles.secondary}
            href={pdf.file}
            target="_blank"
            rel="noopener"
            type="application/pdf"
          >
            Open in browser
          </a>
        </div>

        <p className={styles.meta}>
          PDF{size ? ` · ${size}` : ''} · Free, no sign-up
          {guideHref ? (
            <>
              {' · '}
              <a className={styles.guideLink} href={guideHref}>
                Read the online guide →
              </a>
            </>
          ) : null}
        </p>
      </div>
    </aside>
  );
}