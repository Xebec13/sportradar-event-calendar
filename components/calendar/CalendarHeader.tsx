"use client"

import { useRouter, useSearchParams } from "next/navigation"

/**
 * CalendarHeader — sport filter navigation bar.
 *
 * Receives sports list and active sport from Calendar (Server Component) as props.
 * Prepends "all" pill which clears the ?sport= param entirely.
 * Sport values are lowercase (e.g. "soccer") — displayed capitalized via charAt transform.
 *
 * handleSelect preserves existing URL params (e.g. ?date=) when switching sport.
 * useSearchParams is used solely for URL construction, not for reading active state.
 *
 * Adding a new sport: append a lowercase string to data/sports.ts — no JSX changes needed.
 */
interface Props {
    sports: string[];
    activeSport: string | null;
}

export default function CalendarHeader({ sports, activeSport }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSelect = (sport: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (sport) {
            params.set("sport", sport)
        } else {
            params.delete("sport")
        }
        router.push(`/?${params.toString()}`, { scroll: false })
    }

    const items = ["all", ...sports]

    return (
        <div className="flex items-center gap-6 mt-0.5 min-h-15 py-1.5 px-4 rounded-md bg-blue-950/80  overflow-x-auto">
            {items.map((sport) => {
                const isActive = sport === "all" ? !activeSport : activeSport === sport
                const label = sport.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                return (
                    <button
                        key={sport}
                        onClick={() => handleSelect(sport === "all" ? null : sport)}
                        className={`uppercase font-semibold text-xs md:text-sm whitespace-nowrap border-b-2 cursor-pointer duration-150 transition-all ease-in ${isActive ? "border-red-600" : "border-transparent text-neutral-50/60 hover:text-neutral-50"}`}
                    >
                        {label}
                    </button>
                )
            })}
        </div>
    )
}
