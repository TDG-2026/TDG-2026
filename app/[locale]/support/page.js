import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import {pageMeta} from '@/lib/seo';
const sourceMetadata=pageMeta('Travel Genie Support | Setup & Workflow Help','Find installation help, activation guidance, GDS workflow guides and direct Travel Genie support. Do not send passenger documents.','/support');
export default function Page(){return <L as="section" className="section static-page"><L as="div" className="container"><L as="p" className="eyebrow">Support that starts with the task</L><L as="h1" className="title">A clearer path.<br/><L as="span" className="grad">Back to your work.</L></L><L as="p" className="lead">Find setup instructions and workflow answers, or send the team a product-specific enquiry. Keep passwords, payment-card details and passenger documents out of support messages.</L><L as="div" className="resource-grid">{[['Install or activate','Download, installation, trial and activation guidance.','/guide'],['Understand GDS entries','DOCS, CTCM and CTCE explained with review checks.','/resources/passport-docs-ctcm-ctce-gds'],['Contact the team','Prepare a message with your product and support topic.','/contact'],['Data and privacy','Learn which documented tasks run locally and which use online services.','/security-and-privacy']].map(([h,t,url])=><L as="article" className="card upgrade-card" key={h}><L as="h2">{h}</L><L as="p">{t}</L><Link className="text-link" href={url}>Open {h.toLowerCase()} →</Link></L>)}</L></L></L>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
