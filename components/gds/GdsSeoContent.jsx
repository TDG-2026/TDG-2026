import Link from 'next/link';

import styles from './GdsSeoContent.module.css';

const storeUrl =
  'https://apps.microsoft.com/detail/9p1j21g2z9lz?hl=en-US&gl=PK';

const youtubeUrl =
  'https://www.youtube.com/channel/UCXcwiBG0ojtQK3M0UEZ8Lqw';

export const faqs = [
  [
    'What is the Travel Desk Genie All GDS Search Engine?',
    'It is a searchable reference library for finding and comparing stored Amadeus, Travelport/Galileo and Sabre commands. It does not connect to or execute transactions in a live GDS.',
  ],
  [
    'How do I find and compare GDS commands?',
    'Enter a task or keyword, optionally choose a category or GDS system, and review the available command references side by side. A blank command means no reference has been supplied for that system.',
  ],
  [
    'Can I copy Amadeus, Sabre and Galileo commands?',
    'Yes. Available reference entries have individual Copy controls. Check command syntax, passenger associations and current host or airline requirements before using any command in a live GDS.',
  ],
  [
    'What is the difference between SSR DOCS, CTCM and CTCE?',
    'DOCS is used for travel-document information, while CTCM and CTCE are contact-related special service requests. Required fields and accepted formats can vary by GDS, airline and itinerary.',
  ],
  [
    'Does this website transmit passport information or update a PNR?',
    'No. The search engine is a reference and comparison tool. Searching or copying a command does not send passenger details to an airline or modify a PNR. Do not enter real passenger information into the public search field.',
  ],
  [
    'Where can I learn to use Travel Genie Magic Toolbar?',
    'Visit the Travel Desk Genie video tutorials channel for product demonstrations and training. The Windows Magic Toolbar is a separate desktop application available through its Microsoft Store listing.',
  ],
  [
    'Are GDS command reference PDFs available to download?',
    'Dedicated Amadeus, Travelport/Galileo and Sabre reference PDFs are planned. Download links will be added only after the documents have been reviewed and published.',
  ],
];

export default function GdsSeoContent({ locale = 'en' }) {
  return (
    <div className={styles.content}>

      <section aria-labelledby="gds-guide">
        <h2 id="gds-guide">
          GDS commands search engine for travel agents
        </h2>

        <p>
          Travel Desk Genie helps travel agents and GDS learners
          discover command references for <strong>Amadeus</strong>,
          <strong> Sabre</strong> and
          <strong> Travelport/Galileo</strong> in one place.
          Search by task, category, keyword or command text to
          compare the available entries. This is an educational
          reference tool, not a live booking or ticketing terminal.
        </p>

        <ol>
          <li>
            <strong>Search:</strong> try a task such as city decoding,
            hotel search, reservation, ticket issuance or passport DOCS.
          </li>
          <li>
            <strong>Filter:</strong> narrow results by command category
            or GDS platform.
          </li>
          <li>
            <strong>Compare:</strong> review the three system columns
            side by side.
          </li>
          <li>
            <strong>Copy and verify:</strong> copy a reference command,
            then confirm its current syntax in the relevant official
            GDS and airline documentation.
          </li>
        </ol>
      </section>

      <section aria-labelledby="gds-platforms">
        <h2 id="gds-platforms">
          Compare Amadeus, Sabre and Travelport/Galileo commands
        </h2>

        <p>
          Similar travel-agent tasks can require different formats
          in each GDS. Side-by-side comparison makes it easier to
          identify which reference belongs to which platform.
          An unavailable entry is shown as missing; it should not
          be interpreted as proof that a GDS does not support the task.
        </p>

        <div className={styles.grid}>
          <article>
            <h3>Amadeus GDS commands</h3>
            <p>
              Find available Amadeus references for common PNR,
              reservation, ticketing, hotel and passenger-information
              tasks. Confirm syntax against your current Amadeus environment.
            </p>
            <p><Link href={`/${locale}/resources/amadeus-commands-notes`}>Read the Amadeus commands cheat sheet →</Link></p>
          </article>

          <article>
            <h3>Travelport / Galileo commands</h3>
            <p>
              Explore available Travelport/Galileo references,
              including Smartpoint-related workflows and passenger
              information. Host capabilities and formats may vary.
            </p>
            <p><Link href={`/${locale}/resources/travelport-galileo-commands-notes`}>Read the Travelport Galileo commands cheat sheet →</Link></p>
          </article>

          <article>
            <h3>Sabre GDS commands</h3>
            <p>
              Review available Sabre command references for common
              travel-agency workflows, then verify them against
              the applicable host and airline instructions.
            </p>
            <p><Link href={`/${locale}/resources/sabre-commands-notes`}>Read the Sabre commands cheat sheet →</Link></p>
          </article>
        </div>
      </section>

      <section aria-labelledby="gds-passport">
        <h2 id="gds-passport">
          Passport APIS, SSR DOCS, CTCM and CTCE references
        </h2>

        <p>
          Passport details and passenger contact information are
          common GDS workflows, but they involve different data types.
          Advance Passenger Information (API/APIS) may include
          travel-document details; SSR DOCS is associated with
          document information, while CTCM and CTCE relate to
          passenger contact details. Requirements can depend on
          the carrier, route, GDS and passenger type.
        </p>

        <div className={styles.grid}>
          <article>
            <h3>Amadeus passport and contact entries</h3>
            <p>
              Look up available DOCS, CTCM and CTCE examples.
              Verify document fields, passenger association
              and carrier requirements.
            </p>
            <p><Link href={`/${locale}/resources/passport-docs-ctcm-ctce-gds`}>Read the passport DOCS entry guide →</Link></p>
          </article>

          <article>
            <h3>Travelport Smartpoint / Galileo APIS</h3>
            <p>
              Find available reference entries for entering or
              reviewing passport and contact information, including
              passenger-type differences where documented.
            </p>
            <p><Link href={`/${locale}/resources/adult-child-infant-name-entry-gds`}>Read the adult, child and infant name entry guide →</Link></p>
          </article>

          <article>
            <h3>Sabre passport details and SSR DOCS</h3>
            <p>
              Compare stored Sabre references and check current
              SSR syntax before making changes to a live passenger record.
            </p>
            <p><Link href={`/${locale}/resources/ctcm-ctce-passenger-contacts`}>Read the CTCM and CTCE passenger contacts guide →</Link></p>
          </article>
        </div>

        <p className={styles.note}>
          <strong>Privacy reminder:</strong> Do not type real passport
          numbers, dates of birth, passenger names or contact
          information into this public search field.
          This website does not process live PNRs.
        </p>
      </section>

      <section aria-labelledby="gds-notes">
        <h2 id="gds-notes">
          Amadeus, Galileo and Sabre command notes
        </h2>

        <p>
          Dedicated PDF reference notes are planned for each platform.
          Files will be linked here only after they have been supplied,
          reviewed and published. In the meantime, use the searchable
          command references above.
        </p>

        <div className={styles.grid}>
          <article>
            <h3>Amadeus notes</h3>
            <p>
              Planned reference notes for Amadeus commands
              and passenger-information workflows.
            </p>
            <span className={styles.pending}>
              PDF pending verification
            </span>
          </article>

          <article>
            <h3>Travelport / Galileo notes</h3>
            <p>
              Planned references for Travelport, Galileo
              and Smartpoint workflows.
            </p>
            <span className={styles.pending}>
              PDF pending verification
            </span>
          </article>

          <article>
            <h3>Sabre notes</h3>
            <p>
              Planned Sabre command and passenger-information
              reference notes.
            </p>
            <span className={styles.pending}>
              PDF pending verification
            </span>
          </article>
        </div>
      </section>

      <section
        className={styles.storeSection}
        aria-labelledby="gds-training"
      >
        <div className={styles.storeText}>
          <span className={styles.eyebrow}>
            Optional Windows desktop companion and training
          </span>

          <h2 id="gds-training">
            Travel Genie Magic Toolbar tutorials and product training
          </h2>

          <p>
            Travel Genie Magic Toolbar helps prepare passenger
            NAME, DOCS, CTCM and CTCE entries for review and copying.
            It is separate from the web search engine and does not
            execute live GDS transactions. Explore video tutorials
            for product demonstrations and training.
          </p>

          <a
            className={styles.storeButton}
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Travel Genie Magic Toolbar from Microsoft Store (opens in a new tab)"
          >
            <span className={styles.storeIcon} aria-hidden="true">
              ▦
            </span>

            <span>
              <small>GET IT FROM</small>
              <strong>Microsoft Store</strong>
            </span>

            <span aria-hidden="true">↗</span>
          </a>

          <p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Travel Desk Genie video tutorials
              (opens in a new tab)
            </a>
          </p>

          <p className={styles.storeDisclaimer}>
            Windows desktop application · Microsoft Store download ·
            YouTube training resources
          </p>
        </div>

        <img
          src="/images/tdg-gds-genie.png"
          alt="Travel Desk Genie blue-and-gold Genie mascot"
          width="190"
          height="190"
          loading="lazy"
        />
      </section>

      <section aria-labelledby="gds-editorial">
        <h2 id="gds-editorial">
          About these GDS command references
        </h2>

        <p>
          Travel Desk Genie provides task-focused educational
          references to support command discovery and comparison.
          These examples are not live host responses.
          Actual command support, syntax and acceptance can vary
          with software version, airline, market and itinerary.
          Consult current official GDS and airline guidance before
          using any reference in production.
        </p>

        <p>
          Looking for more travel-agent information? Explore our{' '}
          <a href={`/${locale}/resources`}>
            travel-agent resources
          </a>
          , learn about the{' '}
          <a href={`/${locale}/products/magic-toolbar`}>
            Magic Toolbar
          </a>
          , or{' '}
          <a href={`/${locale}/contact`}>
            contact Travel Desk Genie
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="gds-faq">
        <h2 id="gds-faq">
          Frequently asked questions about GDS commands
        </h2>

        {faqs.map(([question, answer]) => (
          <details key={question} className={styles.faq}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

    </div>
  );
}
