import { buildMonthDays } from '@/utils'
import Day from './Day'
import dayjs from 'dayjs'
import { type Event } from '@/types/event'

interface MonthViewProps {
    currentDate: dayjs.Dayjs
    onEventClick: (event: Event) => void
    onDayClick?: (date: dayjs.Dayjs) => void
    onShowMore?: (date: dayjs.Dayjs) => void
}

export default function MonthView({
    currentDate,
    onEventClick,
    onDayClick,
    onShowMore,
}: MonthViewProps) {
    const days = buildMonthDays(currentDate)

    return (
        <div className="@container">
            <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                {days.map((day, index) => (
                    <Day
                        key={index}
                        day={day}
                        view="month"
                        onEventClick={onEventClick}
                        onDayClick={onDayClick}
                        onShowMore={onShowMore}
                    />
                ))}
            </div>
        </div>
    )
}
