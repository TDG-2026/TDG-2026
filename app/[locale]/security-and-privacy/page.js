import {localizeMetadata} from '@/lib/i18n/metadata';
import {L, Link} from '@/lib/i18n/client';
import {pageMeta} from '@/lib/seo';

const sourceMetadata = pageMeta(
  'Travel Genie Magic Toolbar | Security & Privacy',
  'Learn how Travel Desk Genie handles Google sign-in information, Cloudflare account and subscription records, local travel tools, website storage and privacy requests.',
  '/security-and-privacy'
);

export default function Page() {
  return (
    <L as="section" className="section static-page">
      <L as="div" className="container static-narrow">
        <L as="p" className="eyebrow">
          Know where information goes
        </L>

        <L as="h1" className="title">
          Your workflow.
          <br/>
          <L as="span" className="grad">
            Clear data boundaries.
          </L>
        </L>

        <L as="p" className="lead">
          Travel Desk Genie provides Travel Genie Magic Toolbar.
          This notice explains Google sign-in, machine registration,
          subscription administration and the documented desktop
          and website workflows.
        </L>

        <L as="p">
          Last updated: 5 November 2026.
        </L>

        <L as="h2" id="local-processing">
          What stays on the Windows PC?
        </L>

        <L as="p">
          Passport OCR and photo editing are documented as local tasks.
          Saved family records are described as protected with Windows
          DPAPI for the current Windows account. Use the application’s
          Export/Import feature when moving supported records; do not
          assume raw file copies can be read under another account.
        </L>

        <L as="h2" id="google-sign-in">
          What information does Google sign-in share?
        </L>

        <L as="p">
          The app requests basic identity permissions: openid, email
          and profile. We use your Google account identifier, verified
          email address and display name to identify your customer
          account, link machine access requests and provide account
          and subscription support.
        </L>

        <L as="p">
          Your Google password is entered on Google’s website and is
          not received by Travel Desk Genie. This sign-in does not
          request access to Gmail messages, Google Drive files or
          contacts. Signing in identifies you; machine activation,
          device approval and paid subscription access are managed
          separately. Signing in does not purchase or renew a subscription.
        </L>

        <L as="h2" id="cloudflare-storage">
          What does the Cloudflare service store?
        </L>

        <L as="p">
          Cloudflare Workers and D1 host the account and subscription
          service. Records include customer accounts, machine identifiers,
          device public keys and fingerprints, activation links,
          subscription status and expiry dates, and manually recorded
          payment amounts, currencies, receipt references and renewal
          history. The owner portal can also store internal support
          notes and account or access-security events.
        </L>

        <L as="p">
          Online access checks can record your public IP address,
          country, app version and contact times. Authorized
          administrators use these records to provide customer
          assistance, manage device and subscription access,
          investigate security issues and maintain renewal bookkeeping.
          A payment record is not an automatic bank charge.
        </L>

        <L as="h2" id="data-use-and-sharing">
          How is information used and shared?
        </L>

        <L as="p">
          Google identity information is used for customer identification,
          account linking, access management and related support.
          Google processes the authentication flow, and Cloudflare
          processes the hosted account and subscription records.
          Authorized administrators can view relevant customer
          and subscription details for those purposes.
        </L>

        <L as="p">
          Account and subscription requests use HTTPS. The desktop
          protects its saved app session credentials using Windows
          user-account protection. During sign-in, the browser sends
          a short-lived response to a temporary listener on your own
          PC so the app can finish verifying your account.
        </L>

        <L as="h2" id="online-services">
          What uses an online service?
        </L>

        <L as="p">
          Travel Genie Translate sends selected text to an online
          translation service. Do not send passport or customer
          information unless you have permission and your agency
          approves the service. A toolbar that prepares GDS text
          does not itself establish a booking-system connection.
        </L>

        <L as="h2" id="website-storage">
          What does this website store?
        </L>

        <L as="p">
          Cookie choices, product ordering and chat preferences use
          browser storage. Chat messages are kept in session storage
          by the existing widget. The website has no passport-upload
          form and no installed analytics or advertising service.
          Optional analytics preferences do not themselves load
          a tracking provider.
        </L>

        <L as="h2" id="retention-and-deletion">
          How long are records kept, and how can I request deletion?
        </L>

        <L as="p">
          We keep account, device and subscription records while
          needed to provide the service, resolve support or security
          issues and meet applicable record-keeping obligations.
          Payment and audit history may need to be retained for
          those purposes. Requests to access, correct or delete
          account information are reviewed after verifying account
          ownership; we explain any records that must be retained.
        </L>

        <L as="p">
          Signing out or uninstalling does not automatically erase
          server-side account, subscription, payment or audit history.
          You can remove the app’s Google connection in your Google
          Account settings. Contact support to end Travel Genie
          sessions as well: removing the Google connection does not
          automatically invalidate all existing Travel Genie sessions
          or signed offline allowances. An already-issued offline
          allowance can remain valid until its expiry.
        </L>

        <L as="h2" id="privacy-contact">
          Who handles privacy requests?
        </L>

        <L as="p">
          For privacy questions or requests to access, correct or
          delete account information, email{' '}
          <a href="mailto:info@traveldeskgenie.com">
            info@traveldeskgenie.com
          </a>.
          Our alternate contact is{' '}
          <a href="mailto:traveldeskgenie@gmail.com">
            traveldeskgenie@gmail.com
          </a>.
          Include enough information to identify your account, but
          never send your Google password, session tokens or private keys.
        </L>

        <L as="h2" id="support-data">
          What should I send to support?
        </L>

        <L as="p">
          Send the product name, operating system, release version
          if known and a description of the issue. Redact screenshots.
          Do not send passwords, full payment details, passport scans
          or customer records through the public chat.
        </L>

        <L as="p">
          The optional support diagnostic export can be previewed
          before saving. It contains app, runtime and operating-system
          details and access dates; it excludes passport data,
          databases, raw logs, clipboard contents, customer email,
          machine IDs, tokens and keys. That export does not upload
          anything automatically. Email, chat or WhatsApp providers
          process the information you choose to send through them.
        </L>

        <L as="h2" id="policies">
          Related policies and changes
        </L>

        <L as="p">
          This page describes the account and subscription privacy
          practices above alongside the documented local tools and
          website storage. The{' '}
          <Link href="/terms">terms</Link>,{' '}
          <Link href="/refund">refund</Link> and{' '}
          <Link href="/delivery">delivery</Link> pages cover their
          respective subjects. Material changes to these data
          practices will be reflected in an updated notice.
        </L>

        <Link className="btn btn--primary" href="/contact">
          Ask a data-handling question
        </Link>
      </L>
    </L>
  );
}

export async function generateMetadata({params}) {
  const {locale} = await params;
  return localizeMetadata(sourceMetadata, locale);
}