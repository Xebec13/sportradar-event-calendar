interface Props {
  abbreviation: string;
  won: boolean | null;
}

export default function TeamBadge({ abbreviation, won }: Props) {
  const bg = won ? 'bg-blue-950' : 'bg-blue-950/40';
  const text = won ? 'text-neutral-50' : 'text-neutral-50/40';

  return (
    <div className={`size-12 md:size-16 flex items-center justify-center rounded-lg border border-blue-900/60 ${bg}`}>
      <span className={`text-xs md:text-sm font-bold tracking-widest ${text}`}>
        {abbreviation}
      </span>
    </div>
  );
}
