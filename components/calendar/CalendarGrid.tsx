'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMonthGrid, formatDateString, getEventsForDay, DAY_HEADERS } from '@/lib/date-helpers';
import Badge from '@/components/ui/Badge';
import type { SportEvent } from '@/lib/types';
import GridBg from '../ui/GridBg';

/**
 * CalendarGrid — desktop monthly calendar grid (md+), client component.
 *
 * Renders a 7×6 CSS grid of GridCell components, one per day of the displayed month.
 * Uses getMonthGrid to generate 42 cells always starting on Monday.
 * Events are distributed per cell via getEventsForDay.
 *
 * Clicking a cell updates the URL date param (preserves sport) via router.push({ scroll: false })
 * to prevent the page from jumping to the top on every date selection.
 * Clicking an event Link navigates to /events/[id] — stopPropagation prevents
 * the cell click from firing simultaneously.
 *
 * GridCell: private sub-component colocated here — only used by CalendarGrid.
 * Past event rows are dimmed; the selected date cell gets a red ring.
 */
interface Props {
  year: number;
  month: number;
  events: SportEvent[];
  selectedDate: string;
}

interface GridCellProps {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  events: SportEvent[];
  onSelect: (dateStr: string) => void;
}

function GridCell({ date, dateStr, isCurrentMonth, isToday, isSelected, isPast, events, onSelect }: GridCellProps) {
  const dayNumberClass = isToday || isSelected
    ? 'font-bold text-red-600'
    : !isCurrentMonth
    ? 'text-neutral-50/20'
    : isPast
    ? 'text-neutral-50/30'
    : 'text-neutral-50/60';

  return (
    <div
      onClick={() => onSelect(dateStr)}
      className={`flex flex-col h-full rounded-md overflow-y-auto border border-blue-950/60 cursor-pointer ${isCurrentMonth ? 'bg-blue-950/90' : 'bg-blue-950/60'} ${isSelected ? 'ring-1 ring-inset ring-red-600' : ''}`}
    >
      <div className="flex justify-end px-1.5 pt-1 pb-0.5 shrink-0">
        <span className={`text-sm tabular-nums ${dayNumberClass}`}>{date.getDate()}</span>
      </div>

      <div className="flex flex-col flex-1 p-2">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-blue-900/80 ${isPast ? 'opacity-40' : ''}`}
          >
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-[10px] lg:text-xs text-neutral-50 truncate leading-tight">{event.homeTeam?.name ?? 'TBD'}</span>
              <span className="text-[10px] lg:text-xs text-neutral-50/50 truncate leading-tight">{event.awayTeam?.name ?? 'TBD'}</span>
            </div>

            <div className="flex flex-col items-end gap-0.5 shrink-0">
              {event.result ? (
                <>
                  <span className="text-[10px] lg:text-xs font-bold tabular-nums text-neutral-50">{event.result.homeGoals}</span>
                  <span className="text-[10px] lg:text-xs font-bold tabular-nums text-neutral-50/50">{event.result.awayGoals}</span>
                </>
              ) : (
                <Badge status={event.status} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CalendarGrid({ year, month, events, selectedDate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cells = getMonthGrid(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSelectDate(dateStr: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', dateStr);
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="relative flex flex-col flex-1 rounded-b-md border-x border-b border-blue-950 p-4">
      <GridBg/>
      <div className="grid grid-cols-7">
        {DAY_HEADERS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold tracking-widest text-neutral-50/40 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 gap-0.5 flex-1">
        {cells.map(({ date, isCurrentMonth, isToday }, i) => {
          const dateStr = formatDateString(date);
          return (
            <GridCell
              key={i}
              date={date}
              dateStr={dateStr}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isSelected={dateStr === selectedDate}
              isPast={date < today}
              events={getEventsForDay(events, dateStr)}
              onSelect={handleSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}
