import { buildWeekDays } from '@/utils'
import Day from './Day'
import dayjs from 'dayjs'
import { type Event } from '@/types/event'

interface WeekViewProps {
    currentDate: dayjs.Dayjs
    onEventClick: (event: Event) => void
    onDayClick?: (date: dayjs.Dayjs) => void
}

export default function WeekView({ currentDate, onEventClick, onDayClick }: WeekViewProps) {
    const days = buildWeekDays(currentDate)

    return (
        <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
                <Day
                    key={index}
                    day={day}
                    view="week"
                    onEventClick={onEventClick}
                    onDayClick={onDayClick}
                />
            ))}
        </div>
    )
}
