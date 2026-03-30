import Link from 'next/link';
import Icon from '@/components/ui/icons/Icons';

/**
 * EventHeader — breadcrumb bar at the top of the event detail page.
 *
 * Displays sport → competition → stage path with a back arrow link to /.
 * formatShortDate: converts ISO date string (YYYY-MM-DD) to "DD MON" format
 * using a local month abbreviation map — avoids locale-dependent Intl formatting.
 */
interface Props {
  sport: string;
  competitionName: string;
  stageName: string;
  dateVenue: string;
}

// Month index to 3-letter abbreviation — index 0 = January, matches JS Date month convention
const MONTH_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatShortDate(dateVenue: string): string {
  // Destructure as [year, month, day] — year is skipped intentionally
  const [, month, day] = dateVenue.split('-').map(Number);
  return `${day} ${MONTH_ABBR[month - 1]}`;
}

export default function EventHeader({ sport, competitionName, stageName, dateVenue }: Props) {
  return (
    <div className="min-h-15 flex items-center gap-1.5 bg-blue-950/80 rounded-t-md py-1.5 px-2">
      <Link
        href="/"
        className="flex items-center min-h-10 py-0.5 px-2 md:py-1.5 md:px-4 rounded-md bg-blue-950 transition-colors duration-150 ease-in-out hover:bg-blue-900/80 inset-shadow-xs inset-shadow-neutral-950/60"
      >
        <Icon name="ArrowLeft" className="size-3 md:size-4" />
      </Link>
      <div className="flex items-center gap-0.5 md:gap-3 text-[10px] md:text-xs lg:text-sm text-neutral-50/80">
        <span className="uppercase">{sport}</span>
        <Icon name="ChevronRight" className="size-2 text-neutral-50/40" />
        <span>{competitionName}</span>
        <Icon name="ChevronRight" className="size-2 text-neutral-50/40" />
        <span>{stageName}</span>
        <span>·</span>
        <span>{formatShortDate(dateVenue)}</span>
      </div>
    </div>
  );
}
