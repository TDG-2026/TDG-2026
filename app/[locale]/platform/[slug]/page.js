import {localizeMetadata} from '@/lib/i18n/metadata';
import {notFound} from 'next/navigation';
import ProductPage,{generateMetadata as productMetadata} from '../../products/[slug]/page';
import {products} from '@/data/products';
export const dynamicParams=false;
export function generateStaticParams(){return products.filter(p=>p.path).map(p=>({slug:p.slug}));}
async function generateSourceMetadata({params}){const {slug}=await params;const p=products.find(p=>p.path&&p.slug===slug);if(!p)return {};const m=await productMetadata({params:Promise.resolve({slug})});return {...m,alternates:{canonical:p.path},openGraph:{...m.openGraph,url:p.path}};}
export default async function Page({params}){const {slug}=await params;if(!products.some(p=>p.path&&p.slug===slug))notFound();return <ProductPage params={Promise.resolve({slug})}/>;}

export async function generateMetadata(props){const {locale}=await props.params;return localizeMetadata(await generateSourceMetadata(props),locale);}
