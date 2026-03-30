import Icon from '@/components/ui/icons/Icons';
import type { EventResult, SportEvent } from '@/lib/types';

/**
 * EventTimeline — match event log split into two halves.
 *
 * buildTimeline: merges goals, yellow, second-yellow and red card arrays
 * from EventResult into a single list sorted by minute.
 *
 * Layout: grid-cols-2 with home events on the left and away on the right —
 * each row renders only one side, leaving the other as an empty div spacer.
 *
 * Hidden for scheduled and cancelled matches — result is null in those states.
 * EventIcon, PeriodHeader and TimelineRow are private sub-components,
 * colocated here because they are only used by EventTimeline.
 */
interface Props {
  result: EventResult | null;
  status: SportEvent['status'];
}

type EventKind = 'goal' | 'yellow' | 'second-yellow' | 'red';

interface TimelineEvent {
  minute: number;
  team: 'home' | 'away';
  kind: EventKind;
  player: string;
  detail: string | null;
}

function buildTimeline(result: EventResult): TimelineEvent[] {
  return [
    ...result.goals.map(g => ({ minute: g.minute, team: g.team, kind: 'goal' as const, player: g.scorer, detail: g.assistedBy })),
    ...result.yellowCards.map(c => ({ minute: c.minute, team: c.team, kind: 'yellow' as const, player: c.player, detail: null })),
    ...result.secondYellowCards.map(c => ({ minute: c.minute, team: c.team, kind: 'second-yellow' as const, player: c.player, detail: null })),
    ...result.directRedCards.map(c => ({ minute: c.minute, team: c.team, kind: 'red' as const, player: c.player, detail: null })),
  ].sort((a, b) => a.minute - b.minute);
}

function EventIcon({ kind }: { kind: EventKind }) {
  if (kind === 'goal') {
    return <Icon name="Circle" className="size-3 fill-neutral-50 text-neutral-50 shrink-0" />;
  }
  if (kind === 'yellow') {
    return <Icon name="Square" className="size-3 fill-yellow-400 text-yellow-400 shrink-0" />;
  }
  if (kind === 'second-yellow') {
    return (
      <span className="flex items-center shrink-0">
        <Icon name="Square" className="size-3 fill-yellow-400 text-yellow-400 -mr-1" />
        <Icon name="Square" className="size-3 fill-red-600 text-red-600" />
      </span>
    );
  }
  return <Icon name="Square" className="size-3 fill-red-600 text-red-600 shrink-0" />;
}

function PeriodHeader({ period, homeGoals, awayGoals }: { period: string; homeGoals: number | null; awayGoals: number | null }) {
  const homeWon = homeGoals !== null && awayGoals !== null && homeGoals > awayGoals;
  const awayWon = homeGoals !== null && awayGoals !== null && awayGoals > homeGoals;

  return (
    <div className="flex items-center justify-between bg-blue-950/60 py-1.5 px-4 min-h-10 text-xs">
      <span className="font-semibold tracking-widest text-neutral-50">{period}</span>
      {homeGoals !== null && awayGoals !== null && (
        <div className="flex items-center gap-1.5 tabular-nums">
          <span className={homeWon ? 'font-bold text-neutral-50' : 'text-neutral-50/50'}>{homeGoals}</span>
          <span className="text-neutral-50/30">–</span>
          <span className={awayWon ? 'font-bold text-neutral-50' : 'text-neutral-50/50'}>{awayGoals}</span>
        </div>
      )}
    </div>
  );
}

function TimelineRow({ event }: { event: TimelineEvent }) {
  const isHome = event.team === 'home';
  const label = event.detail ? `${event.player} (${event.detail})` : event.player;

  return (
    <div className="grid grid-cols-2 py-3 text-sm">
      {isHome ? (
        <>
          <div className="flex items-center justify-end gap-2 pr-3">
            <span className="text-neutral-50/90">{label}</span>
            <EventIcon kind={event.kind} />
            <span className="text-neutral-50/50 tabular-nums">{event.minute}&apos;</span>
          </div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div className="flex items-center justify-start gap-2 pl-3">
            <span className="text-neutral-50/50 tabular-nums">{event.minute}&apos;</span>
            <EventIcon kind={event.kind} />
            <span className="text-neutral-50/90">{label}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function EventTimeline({ result, status }: Props) {
  if (!result || status === 'scheduled' || status === 'cancelled') return null;

  const all = buildTimeline(result);
  const firstHalf = all.filter(e => e.minute <= 45);
  const secondHalf = all.filter(e => e.minute > 45);

  const p1 = result.scoreByPeriods?.find(p => p.period === '1H');
  const p2 = result.scoreByPeriods?.find(p => p.period === '2H');

  return (
    <div className="rounded-lg border  border-blue-950">
      <PeriodHeader period="1H" homeGoals={p1?.homeGoals ?? null} awayGoals={p1?.awayGoals ?? null} />
      {firstHalf.map((e, i) => <TimelineRow key={i} event={e} />)}
      <PeriodHeader period="2H" homeGoals={p2?.homeGoals ?? null} awayGoals={p2?.awayGoals ?? null} />
      {secondHalf.map((e, i) => <TimelineRow key={i} event={e} />)}
    </div>
  );
}
