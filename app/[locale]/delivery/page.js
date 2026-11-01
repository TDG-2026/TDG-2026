import {localizeMetadata} from '@/lib/i18n/metadata';
import LegalPage from '@/components/LegalPage';
const sourceMetadata={title:'Delivery',robots:{index:false,follow:true},alternates:{canonical:'/delivery'}};
export default function Page(){return <LegalPage type="delivery"/>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
