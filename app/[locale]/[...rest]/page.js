import {notFound} from 'next/navigation';
import {localizeMetadata} from '@/lib/i18n/metadata';
export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata({title:'Page not found',robots:{index:false,follow:true}},locale);}
export default function UnknownPage(){notFound();}
