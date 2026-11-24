import {notFound} from 'next/navigation';

// Unknown URLs return a real 404. No canonical, no hreflang, never indexed.
export const metadata = {
  title: 'Page not found',
  robots: {index: false, follow: true},
};

export default function UnknownPage() {
  notFound();
}