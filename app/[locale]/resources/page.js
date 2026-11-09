import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import {resources, UNVERIFIED_RESOURCE_SLUGS} from '@/data/resources';
import JsonLd from '@/components/JsonLd';
import {pageMeta,breadcrumbs} from '@/lib/seo';
const sourceMetadata=pageMeta('Travel Desk Guides | Travel Genie Resources','Practical guides to passport entries, DOCS, CTCM, CTCE, visa photo preparation and Windows productivity for travel agents.','/resources');
export default function Page(){return <><JsonLd data={breadcrumbs([['Home','/'],['Resources','/resources']])}/><L as="section" className="section static-page"><L as="div" className="container"><L as="p" className="eyebrow">The travel desk library</L><L as="h1" className="title">Clear answers.<br/><L as="span" className="grad">Useful at your desk.</L></L><L as="p" className="lead">Understand the task, check the details and find your next step. These guides explain the supplied workflows and their limits, without asking for passenger documents.</L><L as="div" className="resource-grid">{resources.map(r=><L as="article" className="card upgrade-card" key={r.slug}><L as="p" className="eyebrow">{r.category}{UNVERIFIED_RESOURCE_SLUGS.has(r.slug) ? " · Pre-release guide" : ""}</L><L as="h2" id={r.slug}><Link href={'/resources/'+r.slug}>{r.title}</Link></L><L as="p">{r.description}</L><Link className="text-link" href={'/resources/'+r.slug}>Read the guide →</Link></L>)}</L></L></L></>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
