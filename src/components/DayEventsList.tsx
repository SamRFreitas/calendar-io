import dayjs from 'dayjs'
import { useAppSelector } from '../store/hooks'
import { selectEventsByDate } from '../store/eventsSlice'
import { type Event } from '../types/event'

interface DayEventsListProps {
    date: string
    onEventClick: (event: Event) => void
    onAddEvent: () => void
}

const typeColorClass: Record<Event['type'], string> = {
    meeting: 'event-meeting',
    task: 'event-task',
}

export default function DayEventsList({ date, onEventClick, onAddEvent }: DayEventsListProps) {
    const events = useAppSelector(selectEventsByDate(date))
    const sortedEvents = [...events].sort((a: Event, b: Event) =>
        dayjs(a.startDate).diff(dayjs(b.startDate))
    )

    return (
        <div className="form-container">
            <h2 className="form-title">{dayjs(date).format('dddd, MMMM D')}</h2>

            <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-2">
                {sortedEvents.map((event: Event) => (
                    <button
                        key={event.id}
                        type="button"
                        onClick={() => onEventClick(event)}
                        className="flex items-center gap-3 min-h-11 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${typeColorClass[event.type]}`} />
                        <span className="text-sm text-muted-foreground shrink-0">
                            {dayjs(event.startDate).format('HH:mm')}
                        </span>
                        <span className="text-sm font-medium text-foreground truncate">
                            {event.name}
                        </span>
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={onAddEvent}
                className="form-button-submit w-full mt-4"
            >
                + Add Event
            </button>
        </div>
    )
}
