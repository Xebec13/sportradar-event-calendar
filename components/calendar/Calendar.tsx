import eventsData from '@/data/events.json';
import { SPORTS } from '@/data/sports';
import { CalendarHeader, CalendarControls, CalendarEventList, CalendarGrid } from '@/components/calendar';
import type { SportEvent } from '@/lib/types';

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
interface Props {
  date?: string;
  sport?: string;
}

// Cast is safe — JSON shape is validated against SportEvent in data/events.json
const allEvents = eventsData.data as SportEvent[];

function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function filterEvents(events: SportEvent[], date: string, sport?: string): SportEvent[] {
  return events.filter((event) => {
    if (event.dateVenue !== date) return false;
    if (sport && event.sport !== sport) return false;
    return true;
  });
}

function filterMonthEvents(events: SportEvent[], monthPrefix: string, sport?: string): SportEvent[] {
  return events.filter((event) => {
    if (!event.dateVenue.startsWith(monthPrefix)) return false;
    if (sport && event.sport !== sport) return false;
    return true;
  });
}

export default function Calendar({ date, sport }: Props) {
  const activeDate = date ?? getTodayString();
  const events = filterEvents(allEvents, activeDate, sport);
  const eventDates = [...new Set(allEvents.map((e) => e.dateVenue))];

  const [yearStr, monthStr] = activeDate.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const monthEvents = filterMonthEvents(allEvents, activeDate.slice(0, 7), sport);

  return (
    <main className="flex flex-col min-h-screen">
      <CalendarHeader sports={SPORTS} activeSport={sport ?? null} />
      <CalendarControls initialDate={activeDate} eventDates={eventDates} />
      <div className="md:hidden">
        <CalendarEventList events={events} />
      </div>
      <div className="hidden md:flex flex-col flex-1 rounded-lg">
        <CalendarGrid year={year} month={month} events={monthEvents} selectedDate={activeDate} />
      </div>
    </main>
  );
}
