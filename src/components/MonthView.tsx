import { buildMonthDays } from '@/utils'
import Day from './Day'
import dayjs from 'dayjs'
import { type Event } from '@/types/event'

interface MonthViewProps {
    currentDate: dayjs.Dayjs
    onEventClick: (event: Event) => void
}

export default function MonthView({
    currentDate,
    onEventClick,
}: MonthViewProps) {
    const days = buildMonthDays(currentDate)

    return (
        <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
                <Day
                    key={index}
                    day={day}
                    view="month"
                    onEventClick={onEventClick}
                />
            ))}
        </div>
    )
}
