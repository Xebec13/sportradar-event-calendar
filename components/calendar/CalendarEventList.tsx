import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import GridBg from '@/components/ui/GridBg';
import type { SportEvent, EventStage } from '@/lib/types';

/**
 * CalendarEventList — server-rendered list of events for the selected date.
 *
 * Events are grouped by stage (Round of 16, Quarter Final, etc.) and sorted
 * by stage.ordering. Each row is a Link to /events/[id] — dynamic routing
 * with no sub-components per view.
 *
 * Empty state: rendered when no events match the active date/sport filter.
 * groupByStage: pure function, runs on the server, returns sorted StageGroup[].
 * formatTime: trims timeVenueUTC to HH:MM for display.
 */
interface Props {
  events: SportEvent[];
}

interface StageGroup {
  stage: EventStage;
  events: SportEvent[];
}

function groupByStage(events: SportEvent[]): StageGroup[] {
  const map = events.reduce<Record<string, StageGroup>>((acc, event) => {
    const key = event.stage.id;
    if (!acc[key]) acc[key] = { stage: event.stage, events: [] };
    acc[key].events.push(event);
    return acc;
  }, {});

  return Object.values(map).sort((a, b) => a.stage.ordering - b.stage.ordering);
}

function formatTime(timeVenueUTC: string): string {
  return timeVenueUTC.slice(0, 5);
}

export default function CalendarEventList({ events }: Props) {
  const groups = groupByStage(events);

  if (events.length === 0) {
    return (
      <section className="relative min-h-screen flex items-start justify-center">
        <GridBg />
        <p className="text-sm text-neutral-50 mt-16">
          No matches found
        </p>
      </section>
    );
  }

  return (
    <section className="relative border-x border-b border-blue-950 min-h-screen">
      <GridBg />
      {groups.map(({ stage, events: stageEvents }) => (
        <div key={stage.id}>
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-neutral-50/80">
            {stage.name}
          </div>
          {stageEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex items-center gap-6 px-4 py-3 bg-blue-950/50 hover:bg-blue-900/80 active:bg-blue-900 min-h-20 w-full inset-shadow-xs inset-shadow-neutral-950/60 hover:inset-shadow-none hover:shadow-neutral-950/80 hover:shadow-sm transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-1.5 min-w-10">
                <span className="text-xs text-neutral-50/50">{formatTime(event.timeVenueUTC)}</span>
                <Badge status={event.status} />
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1">
                <span className="text-sm text-neutral-50">{event.homeTeam?.name ?? 'TBD'}</span>
                <span className="text-sm text-neutral-50/50">{event.awayTeam?.name ?? 'TBD'}</span>
              </div>

              <div className="flex flex-col items-end justify-center gap-1">
                {event.result ? (
                  <>
                    <span className="text-sm font-bold text-neutral-50">{event.result.homeGoals}</span>
                    <span className="text-sm font-bold text-neutral-50/60">{event.result.awayGoals}</span>
                  </>
                ) : (
                  <span className="text-sm text-neutral-50/30">-</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
