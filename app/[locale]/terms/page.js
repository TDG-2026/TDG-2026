import {localizeMetadata} from '@/lib/i18n/metadata';
import LegalPage from '@/components/LegalPage';
const sourceMetadata={title:'Terms',robots:{index:false,follow:true},alternates:{canonical:'/terms'}};
export default function Page(){return <LegalPage type="terms"/>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
