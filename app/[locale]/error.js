'use client';

import {L} from '@/lib/i18n/client';

export default function ErrorPage({reset}) {
  return (
    <L as="section" className="section container" role="alert" aria-live="assertive">
      <L as="h1">This page could not be loaded.</L>
      <L as="p">A temporary page error may have interrupted loading. Please try again or reload the page.</L>
      <L as="div" className="row" style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
        <L as="button" type="button" className="btn btn--primary" onClick={reset}>
          Try again
        </L>
        <L as="button" type="button" className="btn btn--ghost" onClick={() => window.location.reload()}>
          Reload page
        </L>
      </L>
    </L>
  );
}
