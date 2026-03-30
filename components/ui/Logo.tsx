/**
 * Logo — "sportradar" wordmark with a styled "o" placeholder.
 * The "o" is replaced by a red square (bg-red-600) with a dark border,
 * imitating the Sportradar brand mark.
 * Scales up on md breakpoint via responsive text and size utilities.
 */
export default function Logo() {
  return (
    <div className="flex items-center justify-center font-medium text-base leading-0 tracking-wide md:text-lg">
      <span>s</span>
      <span>p</span>
      <span className="grid place-items-center size-3 rounded-sm bg-red-600 md:size-4">
        <span className="size-2.25 rounded-[2.75px] border-[1.5px] border-blue-950 md:size-3.25 md:border-2"></span>
      </span>
      <span>r</span>
      <span>t</span>
      <span className="font-bold">radar</span>
    </div>
  );
}
