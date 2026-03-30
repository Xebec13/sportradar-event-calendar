import { EventHeader, EventMeta, EventScoreBlock, EventTimeline } from '@/components/events';
import GridBg from '@/components/ui/GridBg';
import type { SportEvent } from '@/lib/types';

/**
 * Event — server-rendered detail page layout for a single sport event.
 *
 * Destructures SportEvent and delegates each visual region to a focused
 * sub-component: header (breadcrumb), meta (time + venue), score block, timeline.
 * No logic lives here — all derivations happen in the child components.
 */
interface Props {
  event: SportEvent;
}

export default function Event({ event }: Props) {
  const { homeTeam, awayTeam, result, status, dateVenue, timeVenueUTC, stadium, originCompetitionName, stage, sport } = event;

  return (
    <section className="relative mt-0.5 w-full min-h-screen rounded-md border-x border-t border-blue-950">
      <GridBg />
      <EventHeader
        sport={sport}
        competitionName={originCompetitionName}
        stageName={stage.name}
        dateVenue={dateVenue}
      />
      <EventMeta timeVenueUTC={timeVenueUTC} stadium={stadium} />
      <EventScoreBlock homeTeam={homeTeam} awayTeam={awayTeam} result={result} status={status} />
      <EventTimeline result={result} status={status} />
    </section>
  );
}
