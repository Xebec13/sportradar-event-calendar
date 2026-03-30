"use client"

import { getMonthGrid, isSameDay } from "@/lib/date-helpers"
import Icon from "@/components/ui/icons/Icons"

interface CalendarPickerProps {
    year: number
    month: number
    selectedDate: Date
    onNavigate: (year: number, month: number) => void
    onSelect: (date: Date) => void
}

const DAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

/**
 * CalendarPicker — compact mini calendar rendered inside CalendarControls popup.
 *
 * Structure:
 * - Header: ChevronLeft / month name + year / ChevronRight — navigates viewYear/viewMonth
 *   without affecting selectedDate until a day is explicitly clicked.
 * - Grid: 7 columns (Mon–Sun, EU week start), 6 rows = 42 cells from getMonthGrid().
 *   Days outside current month rendered at /30 opacity.
 *
 * Selected day: bg-red-600 (no hover). All other days: hover:bg-blue-900/80.
 * isSameDay comparison from lib/date-helpers — timezone-safe (uses getFullYear/Month/Date).
 *
 * onNavigate: updates viewYear/viewMonth in parent (CalendarControls).
 * onSelect: passes chosen Date up — CalendarControls handles state update + URL push.
 */
export default function CalendarPicker({ year, month, selectedDate, onNavigate, onSelect }: CalendarPickerProps) {
    const cells = getMonthGrid(year, month)
    const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long" }).toUpperCase()

    const handlePrev = () => {
        if (month === 0) onNavigate(year - 1, 11)
        else onNavigate(year, month - 1)
    }

    const handleNext = () => {
        if (month === 11) onNavigate(year + 1, 0)
        else onNavigate(year, month + 1)
    }

    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between px-1">
                <button className="rounded-sm p-0.5 cursor-pointer hover:bg-blue-900/80" onClick={handlePrev}>
                    <Icon name="ChevronLeft" className="size-3.5" />
                </button>
                <span className="text-xs font-semibold">{monthName} {year}</span>
                <button className="rounded-sm p-0.5 cursor-pointer hover:bg-blue-900/80" onClick={handleNext}>
                    <Icon name="ChevronRight" className="size-3.5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {DAY_HEADERS.map((d) => (
                    <div key={d} className="flex items-center justify-center py-0.5 text-[10px] font-semibold text-neutral-50/50">
                        {d}
                    </div>
                ))}
                {cells.map(({ date, isCurrentMonth }, i) => {
                    const isSelected = isSameDay(date, selectedDate)
                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(date)}
                            className={`flex items-center justify-center py-0.5 rounded-sm text-[10px] cursor-pointer transition-colors duration-150 ${
                                isSelected
                                    ? "bg-red-600 font-semibold"
                                    : isCurrentMonth
                                    ? "text-neutral-50 hover:bg-blue-900/80"
                                    : "text-neutral-50/30 hover:bg-blue-900/80"
                            }`}
                        >
                            {date.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
