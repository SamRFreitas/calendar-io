import dayjs, { Dayjs } from 'dayjs'
import { type Day } from '../types/day'
import { createDay } from './dateHelpers'

export function getStartOfWeek(currentDate: Dayjs): Dayjs {
    return currentDate.startOf('week')
}

export function buildWeekDays(currentDate: Dayjs): Day[] {
    const startOfWeek = getStartOfWeek(currentDate)
    const today = dayjs()
    const currentMonth = currentDate.month()
    const days: Day[] = []

    for (let i = 0; i < 7; i++) {
        const date = startOfWeek.add(i, 'day')
        const isCurrentMonth = date.month() === currentMonth
        days.push(createDay(date, isCurrentMonth, today))
    }

    return days
}
