import { Dayjs } from 'dayjs'
import { type Day } from '../types/day'

export function createDay(
    date: Dayjs,
    isCurrentMonth: boolean,
    today: Dayjs,
): Day {
    return {
        date,
        dayOfMonth: date.date(),
        isCurrentMonth,
        ...(isCurrentMonth && { isToday: date.isSame(today, 'day') }),
    }
}
