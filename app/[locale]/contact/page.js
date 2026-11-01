import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import EnquiryForm from '@/components/EnquiryForm';
import {site} from '@/data/site';
import {pageMeta} from '@/lib/seo';
const sourceMetadata=pageMeta('Contact Travel Genie | Product & Support Enquiries','Ask about Magic Toolbar, pricing, activation or specialist products. Prepare a product-specific email or WhatsApp enquiry.','/contact');
export default function Page(){return <L as="section" className="section static-page"><L as="div" className="container"><L as="div" className="section-head"><L as="p" className="eyebrow">A useful conversation starts here</L><L as="h1" className="title">Your travel desk.<br/><L as="span" className="grad">Our next conversation.</L></L><L as="p" className="lead">Ask about setup, a plan or a product workflow. Tell us what you are trying to do so the team can direct your enquiry.</L></L><L as="div" className="upgrade-split"><EnquiryForm/><L as="aside" className="card upgrade-card"><L as="h2" id="direct-contact">Prefer to contact us directly?</L><L as="p"><L as="a" className="text-link" href={'mailto:'+site.supportEmail}>{site.supportEmail}</L></L><L as="a" className="btn btn--ghost" href={'https://wa.me/'+site.whatsappNumber} target="_blank" rel="noopener noreferrer">Open WhatsApp</L><L as="h3" id="keep-the-details-safe">Keep the details safe.</L><L as="p">Share your product, Windows version and a short description. Do not include passport scans, passwords or full payment information.</L><L as="p" className="fineprint">Demo requests and activation are arranged by the team. This website does not process a payment or guarantee a response time.</L></L></L></L></L>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
