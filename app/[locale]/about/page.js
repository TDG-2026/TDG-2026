import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import {pageMeta} from '@/lib/seo';
import {Link} from '@/lib/i18n/client';

const sourceMetadata=pageMeta('About Travel Genie | Travel Agency Productivity','Meet Travel Genie: Windows travel desk tools and an expanding ecosystem for passenger documents, customer workflows and agency productivity.','/about');

export default function AboutPage() {
  return (
    <L as="section" className="section static-page">
      <L as="div" className="container">
        <L as="p" className="eyebrow">About Travel Genie</L>
        <L as="h1" className="title">A more focused workspace for <L as="span" className="grad">travel desks</L></L>
        <L as="p" className="lead">Travel Genie Magic Toolbar brings common travel-desk tasks into one Windows workspace, helping agents prepare passenger details and review entries before using them in their GDS workflow.</L>
        <L as="div" className="static-grid">
          <L as="article" className="card"><L as="h2" id="keep-everyday-tasks-close">Keep everyday tasks close</L><L as="p">Access passport and passenger-contact workflows, plus practical desk utilities, without treating each task as a separate destination.</L></L>
          <L as="article" className="card"><L as="h2" id="review-before-you-use">Review before you use</L><L as="p">Prepared details are intended to be reviewed by the agent before copying them into a reservation workflow. Always verify passenger information and your GDS requirements.</L></L>
          <L as="article" className="card"><L as="h2" id="designed-for-travel-teams">Designed for travel teams</L><L as="p">The website explains the toolbar’s workflows and provides a place to review plans, release information and support options as they become available.</L></L>
        </L>
        <L as="div" className="page-cta"><Link className="btn btn--primary" href="/#toolbar">Explore Magic Toolbar</Link><Link className="btn btn--ghost" href="/pricing">View pricing</Link></L>
      </L>
    </L>
  );
}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
