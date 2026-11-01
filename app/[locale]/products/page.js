import {localizeMetadata} from '@/lib/i18n/metadata';

import {L} from '@/lib/i18n/client';
import {Link} from '@/lib/i18n/client';
import ProductCatalogue from '@/components/ProductCatalogue';
import JsonLd from '@/components/JsonLd';
import {products,categories} from '@/data/products';
import {pageMeta,breadcrumbs} from '@/lib/seo';
const sourceMetadata=pageMeta('Travel Genie Products | Travel Agency Tools','Find Travel Genie tools for Windows productivity, passenger documents, contacts, CRM and reporting. Check each product’s release status.','/products');
export default function Page(){return <><JsonLd data={breadcrumbs([['Home','/'],['Products','/products']])}/><L as="section" className="section static-page"><L as="div" className="container"><L as="p" className="eyebrow">The Travel Genie ecosystem</L><L as="h1" className="title">The right tool.<br/><L as="span" className="grad">For the work in front of you.</L></L><L as="p" className="lead">Start with Magic Toolbar for Windows travel-desk tasks. Explore separate specialist applications by category, with transparent availability and a direct route to product enquiries.</L><L as="article" className="flagship-banner"><L as="div"><L as="span" className="chip">Flagship · Windows 11, 64-bit</L><L as="h2" id="flagship-product">Travel Genie Magic Toolbar</L><L as="p">Passport entries, passenger contacts and twelve everyday desktop tools.</L></L><Link className="btn btn--primary" href="/products/magic-toolbar">Explore Magic Toolbar →</Link></L></L></L><ProductCatalogue products={products} categories={categories}/></>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
