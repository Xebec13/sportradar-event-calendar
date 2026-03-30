import Badge from '@/components/ui/Badge';
import TeamBadge from '@/components/ui/TeamBadge';
import type { SportEvent, Team, EventResult } from '@/lib/types';

/**
 * EventScoreBlock — central score display between both teams.
 *
 * Renders home/away team badges, names, goal counts and match status badge.
 * Winner is derived from result.winnerId: null means draw or match not yet played.
 * Goals fall back to null (displayed as "–") when result is not yet available.
 */
interface Props {
  homeTeam: Team | null;
  awayTeam: Team | null;
  result: EventResult | null;
  status: SportEvent['status'];
}

export default function EventScoreBlock({ homeTeam, awayTeam, result, status }: Props) {
  // winnerId === null means draw — only highlight a winner when explicitly set
  const homeWon = result?.winnerId !== null && result?.winnerId === homeTeam?.slug;
  const awayWon = result?.winnerId !== null && result?.winnerId === awayTeam?.slug;

  return (
    <div className="flex items-center justify-between p-6 min-h-[25vh]">

      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamBadge abbreviation={homeTeam?.abbreviation ?? '—'} won={homeWon} />
        <span className={`text-base md:text-lg lg:text-xl text-center whitespace-nowrap leading-tight ${homeWon ? 'font-bold text-neutral-50' : 'font-normal text-neutral-50/50'}`}>
          {homeTeam?.name ?? '—'}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 md:gap-4">
          <span className={`text-2xl md:text-6xl tabular-nums w-10 text-center ${homeWon ? 'font-bold text-neutral-50' : 'font-normal text-neutral-50/50'}`}>
            {result?.homeGoals ?? '–'}
          </span>
          <span className="text-3xl text-red-600">:</span>
          <span className={`text-2xl md:text-6xl tabular-nums w-10 text-center ${awayWon ? 'font-bold text-neutral-50' : 'font-normal text-neutral-50/50'}`}>
            {result?.awayGoals ?? '–'}
          </span>
        </div>
        <Badge status={status} />
      </div>

      <div className="flex flex-col items-center gap-2 flex-1">
        <TeamBadge abbreviation={awayTeam?.abbreviation ?? '—'} won={awayWon} />
        <span className={`text-base md:text-lg lg:text-xl text-center whitespace-nowrap leading-tight ${awayWon ? 'font-bold text-neutral-50' : 'font-normal text-neutral-50/50'}`}>
          {awayTeam?.name ?? '—'}
        </span>
      </div>

    </div>
  );
}
