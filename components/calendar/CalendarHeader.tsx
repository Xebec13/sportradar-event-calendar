"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SPORTS } from "@/data/sports"

/**
 * CalendarHeader — sport filter navigation bar.
 *
 * Renders a horizontal scrollable row of pill buttons: "All" first, then
 * each sport from data/sports.ts. Clicking a pill updates the ?sport= URL
 * param; "All" removes it entirely.
 *
 * Active pill: red-600 bottom border. Inactive: neutral-50/60 text, no border.
 *
 * Adding a new sport: append a string to SPORTS in data/sports.ts — no JSX changes needed.
 * Future: when a sport form is added, SPORTS will be replaced by a useSports hook
 * reading from localStorage with data/sports.ts as seed fallback.
 */
export default function CalendarHeader() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeSport = searchParams.get("sport")

    const handleSelect = (sport: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (sport) {
            params.set("sport", sport)
        } else {
            params.delete("sport")
        }
        router.push(`/?${params.toString()}`)
    }

    const items = ["All", ...SPORTS]

    return (
        <div className="flex items-center gap-6 mt-0.5 min-h-15 py-1.5 px-4 rounded-md bg-blue-950/80 overflow-x-auto">
            {items.map((sport) => {
                const isActive = sport === "All" ? !activeSport : activeSport === sport
                return (
                    <button
                        key={sport}
                        onClick={() => handleSelect(sport === "All" ? null : sport)}
                        className={`uppercase font-semibold text-xs md:text-sm whitespace-nowrap border-b-2 cursor-pointer duration-150 transition-all ease-in ${isActive ? "border-red-600" : "border-transparent text-neutral-50/60 hover:text-neutral-50"}`}
                    >
                        {sport}
                    </button>
                )
            })}
        </div>
    )
}
