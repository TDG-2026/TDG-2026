import {localizeMetadata} from '@/lib/i18n/metadata';
import LegalPage from '@/components/LegalPage';
const sourceMetadata={title:'Refund',robots:{index:false,follow:true},alternates:{canonical:'/refund'}};
export default function Page(){return <LegalPage type="refund"/>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
