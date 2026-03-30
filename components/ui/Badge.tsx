import type { SportEvent } from '@/lib/types';

interface Props {
  status: SportEvent['status'];
}

const config: Record<SportEvent['status'], { label: string; className: string }> = {
  played:    { label: 'FT',   className: 'bg-neutral-50/10 text-neutral-50/80' },
  scheduled: { label: 'SCH',  className: 'bg-blue-950 text-neutral-50/80' },
  live:      { label: 'LIVE', className: 'bg-red-600/15 text-red-600 font-semibold' },
  cancelled: { label: 'CAN',  className: 'bg-neutral-50/10 text-neutral-50/30' },
};

export default function Badge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded tracking-wide ${className}`}>
      {label}
    </span>
  );
}
