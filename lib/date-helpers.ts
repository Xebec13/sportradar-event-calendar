import type { SportEvent } from '@/lib/types';

export const DAY_HEADERS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export interface DayCell {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
}

// Returns true only when two dates share the same calendar day — ignores time
export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

// Formats a Date to YYYY-MM-DD — matches the dateVenue field format in SportEvent
export function formatDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Matches events by their dateVenue string — O(n), fine for session-size datasets
export function getEventsForDay(events: SportEvent[], dateStr: string): SportEvent[] {
    return events.filter(e => e.dateVenue === dateStr)
}

// Builds a 42-cell grid (6 full weeks) — always enough to cover any month layout
// (firstDay.getDay() + 6) % 7 converts JS Sunday=0 convention to Mon=0 week start
export function getMonthGrid(year: number, month: number): DayCell[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const firstDay = new Date(year, month, 1)
    const startOffset = (firstDay.getDay() + 6) % 7
    const start = new Date(year, month, 1 - startOffset)

    return Array.from({ length: 42 }, (_, i) => {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
        return {
            date,
            isCurrentMonth: date.getMonth() === month,
            isToday: date.getTime() === today.getTime(),
        }
    })
}
