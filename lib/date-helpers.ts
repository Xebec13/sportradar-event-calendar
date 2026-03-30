export interface DayCell {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

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
