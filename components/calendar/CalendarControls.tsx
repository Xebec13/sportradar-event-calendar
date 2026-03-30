"use client"

import { useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CalendarPicker from "@/components/calendar/CalendarPicker"
import Icon from "@/components/ui/icons/Icons"
import { useClickOutside } from "@/hooks/use-click-outside"

/**
 * CalendarControls — date navigation bar sitting above the event list.
 *
 * Structure:
 * - Left / Right: ChevronLeft / ChevronRight buttons — step one day prev/next via handlePrevDay/handleNextDay.
 * - Center: date trigger (CalendarDays icon + dateLabel) — toggles the CalendarPicker popup.
 *
 * Props:
 * - initialDate: YYYY-MM-DD string from URL searchParams — parsed via parseDateString to avoid
 *   timezone offset issues that arise from new Date("YYYY-MM-DD") treating input as UTC.
 *   Falls back to today when not provided.
 *
 * State:
 * - selectedDate: the active date; drives dateLabel and is passed to CalendarPicker.
 * - viewYear / viewMonth: independent picker navigation — changing month in picker does not affect selectedDate.
 * - isPickerOpen: controls popup visibility via CSS grid-rows trick (0fr → 1fr).
 *
 * handleSelect: single entry point for date changes — updates selectedDate, closes picker,
 * pushes /?date=YYYY-MM-DD to the URL. Both chevrons and CalendarPicker route through it.
 *
 * dateLabel format: "2026 / 03 / 30 MON" — derived from selectedDate on every render.
 *
 * Popup closes on outside click via useClickOutside(pickerRef).
 */
interface Props {
    initialDate?: string;
    eventDates?: string[];
}

function parseDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export default function CalendarControls({ initialDate, eventDates }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pickerRef = useRef<HTMLDivElement>(null)
    const initial = initialDate ? parseDateString(initialDate) : new Date()
    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(initial)
    const [viewYear, setViewYear] = useState(initial.getFullYear())
    const [viewMonth, setViewMonth] = useState(initial.getMonth())

    useClickOutside(pickerRef, () => setIsPickerOpen(false))

    const dateLabel = `${selectedDate.getFullYear()} / ${String(selectedDate.getMonth() + 1).padStart(2, "0")} / ${String(selectedDate.getDate()).padStart(2, "0")} ${selectedDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`

    const handleNavigate = (year: number, month: number) => {
        setViewYear(year)
        setViewMonth(month)
    }

    const handleSelect = (date: Date) => {
        setSelectedDate(date)
        setIsPickerOpen(false)
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
        const params = new URLSearchParams(searchParams.toString())
        params.set("date", dateStr)
        router.push(`/?${params.toString()}`)
    }

    const handlePrevDay = () => {
        const prev = new Date(selectedDate)
        prev.setDate(prev.getDate() - 1)
        handleSelect(prev)
    }

    const handleNextDay = () => {
        const next = new Date(selectedDate)
        next.setDate(next.getDate() + 1)
        handleSelect(next)
    }

    return (
        <div className="flex items-center justify-between gap-1 mt-0.5 min-h-15 py-1.5 px-2 rounded-t-md border border-blue-950 bg-blue-950/40 ">
            <button onClick={handlePrevDay} className="flex items-center min-h-10 py-1 px-2 md:py-2 md:px-4 rounded-md bg-blue-950/80 transition-colors duration-150 ease-in-out hover:bg-blue-900/80 inset-shadow-xs inset-shadow-neutral-950/60 cursor-pointer">
                <Icon name="ChevronLeft" className="size-4 md:size-5" />
            </button>

            <div ref={pickerRef} className="flex flex-1 items-center justify-center gap-2 min-h-10 h-full rounded-md bg-blue-950/80 inset-shadow-xs inset-shadow-neutral-950/60 ">
                <div className="relative flex items-end justify-center gap-3 py-1.5 px-4 rounded-md bg-blue-950 border border-neutral-950/50 duration-150 transition-colors hover:bg-blue-900/80 cursor-pointer" onClick={() => setIsPickerOpen((prev) => !prev)}>
                    <Icon name="CalendarDays" className="size-4 md:size-5" />
                    <span className="text-xs font-semibold md:text-sm">{dateLabel}</span>
                    <div onClick={(e) => e.stopPropagation()} className={`mt-0.5 absolute grid z-50 top-full left-0 min-w-44 rounded-md border border-neutral-950/50 shadow-md transition-all ease-in-out duration-150 ${isPickerOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                            <div className="rounded-md bg-blue-950">
                                <CalendarPicker year={viewYear} month={viewMonth} selectedDate={selectedDate} onNavigate={handleNavigate} onSelect={handleSelect} eventDates={eventDates} />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <button onClick={handleNextDay} className="flex items-center min-h-10 py-1 px-2 md:py-2 md:px-4 rounded-md bg-blue-950/80 transition-colors duration-150 ease-in-out hover:bg-blue-900/80 inset-shadow-xs inset-shadow-neutral-950/60 cursor-pointer">
                <Icon name="ChevronRight" className="size-4 md:size-5" />
            </button>
        </div>
    )
}
