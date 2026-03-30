'use client';

import { CalendarHeader, CalendarControls, CalendarEventList, CalendarGrid } from '@/components/calendar';
import { useEvents } from '@/hooks/use-events';

interface Props {
  date: string;
  sport?: string;
}
/**
 * Calendar — server-side orchestrator for the main calendar view.
 *
 * Reads events from the static JSON seed and filters them by date and sport
 * based on URL searchParams passed down from app/page.tsx.
 * Passes day-filtered events to CalendarEventList (mobile) and month-filtered
 * events to CalendarGrid (md+). CalendarControls receives initial state only.
 *
 * filterEvents runs on the server — no client-side state, no re-renders on filter change.
 * Adding a new filter param: extend Props, add a condition in filterEvents, pass it through.
 */
export default function Calendar({ date, sport }: Props) {
  const { events: allEvents } = useEvents();


  const activeDate = date;
  const sports = [...new Set(allEvents.map((e) => e.sport))].sort();
  const eventDates = [...new Set(allEvents.map((e) => e.dateVenue))];

  const filteredEvents = allEvents.filter(e =>
    e.dateVenue === activeDate && (!sport || e.sport === sport)
  );

  const [yearStr, monthStr] = activeDate.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const monthEvents = allEvents.filter(e => e.dateVenue.startsWith(activeDate.slice(0, 7)) && (!sport || e.sport === sport));

  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">

      <CalendarHeader sports={sports} activeSport={sport ?? null} />
      <CalendarControls initialDate={activeDate} eventDates={eventDates} />

      <div className="md:hidden">
        <CalendarEventList events={filteredEvents} />
      </div>

      <div className="hidden md:flex flex-col flex-1 rounded-lg">
        <CalendarGrid
          year={year}
          month={month}
          events={monthEvents}
          selectedDate={activeDate}
        />
      </div>
    </main>
  );
}