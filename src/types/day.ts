import { Dayjs } from 'dayjs'

export interface Day {
    date: Dayjs
    dayOfMonth: number
    isCurrentMonth: boolean
    isToday?: boolean
}
