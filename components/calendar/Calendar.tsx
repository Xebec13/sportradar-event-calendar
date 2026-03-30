import eventsData from '@/data/events.json';
import { SPORTS } from '@/data/sports';
import { CalendarHeader, CalendarControls, CalendarEventList } from '@/components/calendar';
import type { SportEvent } from '@/lib/types';

/**
 * Calendar — server-side orchestrator for the main calendar view.
 *
 * Reads events from the static JSON seed and filters them by date and sport
 * based on URL searchParams passed down from app/page.tsx.
 * Passes filtered data to CalendarEventList and initial state to CalendarControls.
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

export default function Calendar({ date, sport }: Props) {
  const activeDate = date ?? getTodayString();
  const events = filterEvents(allEvents, activeDate, sport);

  return (
    <main>
      <CalendarHeader sports={SPORTS} activeSport={sport ?? null} />
      <CalendarControls initialDate={activeDate} />
      <CalendarEventList events={events} />
    </main>
  );
}
