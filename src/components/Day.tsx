import { type Day as DayType } from '../types/day'
import { type ScheduleType } from '../types/schedule'
import { useAppSelector } from '../store/hooks'
import { selectEventsByDate } from '../store/eventsSlice'
import { type Event } from '../types/event'
import { typeColorClass, typeIcon } from '../utils/eventTypeVisuals'
import dayjs from 'dayjs'

interface DayProps {
    day: DayType
    view: ScheduleType
    onEventClick: (event: Event) => void
    onDayClick?: (date: dayjs.Dayjs) => void
    onShowMore?: (date: dayjs.Dayjs) => void
}

const getEventClasses = (event: Event) =>
    `event-badge event-badge-hover ${typeColorClass[event.type]}`

const MAX_VISIBLE_EVENTS = 2
const MAX_VISIBLE_DOTS = 4

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
        className += ' bg-muted text-muted-foreground cursor-not-allowed'
    }

    if (isClickable) {
        className += ' calendar-day-hover'
    }

    const handleDayClick = () => {
        if (window.innerWidth < 768) {
            // A past day with events is still viewable/editable (same as its
            // individual event badges already are on desktop); an empty past
            // day has nothing to show and isn't a valid place to create one.
            if (sortedEvents.length > 0 || isClickable) {
                onShowMore?.(day.date)
            }
            return
        }
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

            <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 flex items-center justify-center">
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

            <div className="absolute bottom-1.5 md:bottom-2.5 left-1.5 md:left-2.5 right-1.5 md:right-2.5 hidden md:flex flex-col gap-1 text-xs">
                {visibleEvents.map((event: Event) => (
                    <div
                        key={event.id}
                        className={`${getEventClasses(event)} flex items-center gap-1`}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                        data-testid={`event-${event.id}`}
                    >
                        {typeIcon[event.type]('w-3 h-3 shrink-0')}
                        <span className="truncate">
                            {dayjs(event.startDate).format('HH:mm')} {event.name}
                        </span>
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

            {sortedEvents.length > 0 && (
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex md:hidden items-center justify-center gap-0.5">
                    {sortedEvents.slice(0, MAX_VISIBLE_DOTS).map((event: Event) => (
                        <span key={event.id} className={`event-dot ${typeColorClass[event.type]}`} />
                    ))}
                    {sortedEvents.length > MAX_VISIBLE_DOTS && (
                        <span className="text-[9px] text-muted-foreground leading-none">
                            +{sortedEvents.length - MAX_VISIBLE_DOTS}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}