import { type Day as DayType } from '@/types/day'
import { type ScheduleType } from '@/types/schedule'
import { useAppSelector } from '@/store/hooks'
import { selectEventsByDate } from '@/store/eventsSlice'
import { type Event } from '@/types/event'

interface DayProps {
    day: DayType
    view: ScheduleType
    onEventClick: (event: Event) => void
}

const typeColorClass = {
    meeting: 'event-meeting',
    slot: 'event-slot',
    task: 'event-task',
}

export default function Day({ day, view, onEventClick }: DayProps) {
    const dateStr = day.date.format('YYYY-MM-DD')
    const events = useAppSelector(selectEventsByDate(dateStr))

    const isOtherMonth = !day.isCurrentMonth
    const isToday = day.isToday ?? false

    let className = 'calendar-day relative'

    if (view === 'month' && isOtherMonth) {
        className += ' opacity-0 pointer-events-none'
    }
    if (view === 'week' && isOtherMonth) {
        className += ' bg-gray-100 text-gray-400'
    }
    if (day.isToday) {
        className += ' calendar-day-today'
    }

    return (
        <div className={className}>
            <div className="absolute top-1 right-1 flex items-center justify-center">
                {isToday ? (
                <span className="bg-black text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {day.dayOfMonth}
                </span>
                ) : (
                <span className={`text-sm font-medium ${isOtherMonth ? 'text-gray-400' : ''}`}>
                    {day.dayOfMonth}
                </span>
                )}
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-0.5 text-xs">
                {events.map((event: Event) => (
                    <div
                        key={event.id}
                        className={`event-badge event-badge-hover ${typeColorClass[event.type]}`}
                        onClick={() => onEventClick(event)}
                    >
                        {event.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
