
import {L} from '@/lib/i18n/client';
const labels = {
  available: ['Available', 'chip--ok'],
  preview: ['Details coming', 'chip--info'],
  soon: ['Coming soon', 'chip--muted'],
};

export default function StatusBadge({ status }) {
  const [label, cls] = labels[status] || labels.preview;
  return <L as="span" className={`chip ${cls}`}>{label}</L>;
}