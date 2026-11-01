import {localizeMetadata} from '@/lib/i18n/metadata';
import LegalPage from '@/components/LegalPage';
const sourceMetadata={title:'Privacy',robots:{index:false,follow:true},alternates:{canonical:'/privacy'}};
export default function Page(){return <LegalPage type="privacy"/>}

export async function generateMetadata({params}){const {locale}=await params;return localizeMetadata(sourceMetadata,locale);}
