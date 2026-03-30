/**
 * EventMeta — secondary info row below the score block.
 *
 * Shows UTC kickoff time and optional stadium name.
 * Stadium is conditionally rendered — null means venue is not yet confirmed.
 */
interface Props {
  timeVenueUTC: string;
  stadium: string | null;
}

export default function EventMeta({ timeVenueUTC, stadium }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 p-4 text-xs md:text-sm text-neutral-50/70 border-b border-blue-950/40">
      <span>{timeVenueUTC.slice(0, 5)} UTC</span>
      {stadium && (
        <>
          <span>·</span>
          <span>{stadium}</span>
        </>
      )}
    </div>
  );
}
