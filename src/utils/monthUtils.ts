import dayjs, { Dayjs } from 'dayjs'
import { type Day } from '../types/day'
import { createDay } from './dateHelpers'

export function getDaysFromPreviousMonth(startOfMonth: Dayjs): number {
    return startOfMonth.day()
}

export function calculateTotalDays(
    daysFromPrevMonth: number,
    daysInMonth: number,
): number {
    return Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7
}

export function generatePreviousMonthDays(
    startOfMonth: Dayjs,
    daysFromPrevMonth: number,
    today: Dayjs,
): Day[] {
    const prevMonth = startOfMonth.subtract(1, 'month')
    const daysInPrevMonth = prevMonth.daysInMonth()
    const days: Day[] = []

    for (let i = 0; i < daysFromPrevMonth; i++) {
        const day = daysInPrevMonth - daysFromPrevMonth + i + 1
        const date = prevMonth.date(day)
        days.push(createDay(date, false, today))
    }

    return days
}

export function generateCurrentMonthDays(
    startOfMonth: Dayjs,
    daysInMonth: number,
    today: Dayjs,
): Day[] {
    const days: Day[] = []

    for (let i = 1; i <= daysInMonth; i++) {
        const date = startOfMonth.date(i)
        days.push(createDay(date, true, today))
    }

    return days
}

export function generateNextMonthDays(
    startOfMonth: Dayjs,
    remainingDays: number,
    today: Dayjs,
): Day[] {
    const nextMonth = startOfMonth.add(1, 'month')
    const days: Day[] = []

    for (let i = 1; i <= remainingDays; i++) {
        const date = nextMonth.date(i)
        days.push(createDay(date, false, today))
    }

    return days
}

export function buildMonthDays(currentDate: Dayjs): Day[] {
    const today = dayjs()
    const startOfMonth = currentDate.startOf('month')
    const daysInMonth = currentDate.daysInMonth()
    const daysFromPrevMonth = getDaysFromPreviousMonth(startOfMonth)
    const totalDays = calculateTotalDays(daysFromPrevMonth, daysInMonth)

    const prevMonthDays = generatePreviousMonthDays(
        startOfMonth,
        daysFromPrevMonth,
        today,
    )
    const currentMonthDays = generateCurrentMonthDays(
        startOfMonth,
        daysInMonth,
        today,
    )
    const remainingDays =
        totalDays - prevMonthDays.length - currentMonthDays.length
    const nextMonthDays = generateNextMonthDays(
        startOfMonth,
        remainingDays,
        today,
    )

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
}
