import { type Day as DayType } from '../types/day'
import { type ScheduleType } from '../types/schedule'
import { useAppSelector } from '../store/hooks'
import { selectEventsByDate } from '../store/eventsSlice'
import { type Event } from '../types/event'
import dayjs from 'dayjs'

interface DayProps {
    day: DayType
    view: ScheduleType
    onEventClick: (event: Event) => void
    onDayClick?: (date: dayjs.Dayjs) => void
}

const typeColorClass = {
    meeting: 'event-meeting',
    task: 'event-task',
}

const getEventClasses = (event: Event) => {
    const baseClasses = `event-badge event-badge-hover ${typeColorClass[event.type]}`
    if (event.allDay) {
        return `${baseClasses} multi-day`
    }
    return baseClasses
}

export default function Day({ day, view, onEventClick, onDayClick }: DayProps) {
    const dateStr = day.date.format('YYYY-MM-DD')
    const events = useAppSelector(selectEventsByDate(dateStr))

    const isOtherMonth = !day.isCurrentMonth
    const isToday = day.isToday ?? false
    const isPast = day.date.isBefore(dayjs(), 'day')

    const sortedEvents = [...events].sort((a, b) =>
        dayjs(a.startDate).diff(dayjs(b.startDate))
    )

    let className = 'calendar-day relative'

    if (view === 'month' && isOtherMonth) {
        className += ' opacity-0 pointer-events-none'
    }

    if (isToday) {
        className += ' calendar-day-today'
    }

    if (isPast && !isOtherMonth && !isToday) {
        className += ' bg-gray-100 text-gray-500'
    }

    const handleDayClick = () => {
        if (!isOtherMonth && onDayClick) {
            onDayClick(day.date)
        }
    }

    return (
        <div className={className} onClick={handleDayClick}>
            {view === 'week' && (
                <span className="absolute top-1 left-1 text-xs font-medium text-gray-500">
                    {day.date.format('MMM')}
                </span>
            )}

            <div className="absolute top-1 right-1 flex items-center justify-center">
                {isToday ? (
                    <span className="bg-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                        {day.dayOfMonth}
                    </span>
                ) : (
                    <span
                        className={`text-sm font-medium ${
                            isPast && !isOtherMonth ? 'text-gray-500' : ''
                        } ${isOtherMonth ? 'text-gray-400' : ''}`}
                    >
                        {day.dayOfMonth}
                    </span>
                )}
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-0.5 text-xs">
                {sortedEvents.map((event: Event) => (
                    <div
                        key={event.id}
                        className={getEventClasses(event)}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                        data-testid={`event-${event.id}`}
                    >
                        {event.name}
                    </div>
                ))}
            </div>
        </div>
    )
}