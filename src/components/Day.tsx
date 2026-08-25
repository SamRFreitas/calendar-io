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
    onShowMore?: (date: dayjs.Dayjs) => void
}

const typeColorClass = {
    meeting: 'event-meeting',
    task: 'event-task',
}

const getEventClasses = (event: Event) =>
    `event-badge event-badge-hover ${typeColorClass[event.type]}`

const MAX_VISIBLE_EVENTS = 2

export default function Day({ day, view, onEventClick, onDayClick, onShowMore }: DayProps) {
    const dateStr = day.date.format('YYYY-MM-DD')
    const events = useAppSelector(selectEventsByDate(dateStr))

    const isOtherMonth = !day.isCurrentMonth
    const isToday = day.isToday ?? false
    const isPast = day.date.isBefore(dayjs(), 'day')
    const isClickable = !isOtherMonth && !isPast

    const sortedEvents = [...events].sort((a, b) =>
        dayjs(a.startDate).diff(dayjs(b.startDate))
    )
    const visibleEvents = sortedEvents.slice(0, MAX_VISIBLE_EVENTS)
    const hiddenCount = sortedEvents.length - visibleEvents.length

    let className = 'calendar-day'

    if (view === 'month' && isOtherMonth) {
        className += ' opacity-0 pointer-events-none'
    }

    if (isToday) {
        className += ' calendar-day-today'
    }

    if (isPast && !isOtherMonth && !isToday) {
        className += ' bg-muted text-muted-foreground'
    }

    if (isClickable) {
        className += ' calendar-day-hover'
    }

    const handleDayClick = () => {
        if (isClickable && onDayClick) {
            onDayClick(day.date)
        }
    }

    return (
        <div className={className} onClick={handleDayClick}>
            {view === 'week' && (
                <span className="absolute top-1 left-1 text-[10px] md:text-xs font-medium text-muted-foreground">
                    {day.date.format('MMM')}
                </span>
            )}

            <div className="absolute top-1 right-1 flex items-center justify-center">
                {isToday ? (
                    <span className="bg-primary text-white font-bold rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm">
                        {day.dayOfMonth}
                    </span>
                ) : (
                    <span
                        className={`text-sm font-medium ${
                            isPast && !isOtherMonth ? 'text-muted-foreground' : ''
                        } ${isOtherMonth ? 'text-muted-foreground' : ''}`}
                    >
                        {day.dayOfMonth}
                    </span>
                )}
            </div>

            <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 right-1 md:right-2 flex flex-col gap-1 text-xs">
                {visibleEvents.map((event: Event) => (
                    <div
                        key={event.id}
                        className={getEventClasses(event)}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                        data-testid={`event-${event.id}`}
                    >
                        {event.name}
                    </div>
                ))}
                {hiddenCount > 0 && (
                    <div
                        className="event-badge-more"
                        onClick={(e) => { e.stopPropagation(); onShowMore?.(day.date); }}
                    >
                        +{hiddenCount} more
                    </div>
                )}
            </div>
        </div>
    )
}