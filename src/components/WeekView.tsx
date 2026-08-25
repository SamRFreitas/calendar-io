import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { buildWeekDays } from '@/utils'
import { getEventSegmentForDay } from '@/utils/dateHelpers'
import { useAppSelector } from '@/store/hooks'
import { selectEventsByDate } from '@/store/eventsSlice'
import { type Event } from '@/types/event'
import { type Day } from '@/types/day'

interface WeekViewProps {
    currentDate: dayjs.Dayjs
    onEventClick: (event: Event) => void
    onCellClick: (date: dayjs.Dayjs, hour: number) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const typeColorClass: Record<Event['type'], string> = {
    meeting: 'event-meeting',
    task: 'event-task',
}

interface WeekDayColumnProps {
    day: Day
    now: dayjs.Dayjs
    onEventClick: (event: Event) => void
    onCellClick: (date: dayjs.Dayjs, hour: number) => void
}

function WeekDayColumn({ day, now, onEventClick, onCellClick }: WeekDayColumnProps) {
    const dateStr = day.date.format('YYYY-MM-DD')
    const events = useAppSelector(selectEventsByDate(dateStr))

    return (
        <div className="week-grid-day-column">
            {HOURS.map((hour) => {
                const isCellPast = day.date.hour(hour).isBefore(now, 'hour')
                return (
                    <div
                        key={hour}
                        className={`week-grid-hour-cell ${isCellPast ? 'week-grid-hour-cell-past' : 'week-grid-hour-cell-clickable'}`}
                        onClick={() => {
                            if (!isCellPast) onCellClick(day.date, hour)
                        }}
                    />
                )
            })}
            {events.map((event: Event) => {
                const segment = getEventSegmentForDay(event, day.date)
                if (!segment) return null
                return (
                    <div
                        key={event.id}
                        className={`event-badge event-badge-hover ${typeColorClass[event.type]} absolute left-0.5 right-0.5 overflow-hidden`}
                        style={{ top: `${segment.topPercent}%`, height: `${segment.heightPercent}%` }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onEventClick(event)
                        }}
                        data-testid={`event-${event.id}`}
                    >
                        {event.name}
                        {segment.continuesAfter && <span className="ml-1">▸</span>}
                    </div>
                )
            })}
        </div>
    )
}

export default function WeekView({ currentDate, onEventClick, onCellClick }: WeekViewProps) {
    const days = buildWeekDays(currentDate)
    const [now, setNow] = useState(dayjs())

    useEffect(() => {
        const interval = setInterval(() => setNow(dayjs()), 60000)
        return () => clearInterval(interval)
    }, [])

    const showCurrentTime = days.some((day) => day.isToday)
    const nowPercent = ((now.hour() * 60 + now.minute()) / 1440) * 100

    return (
        <div>
            <div className="flex">
                <div className="week-grid-gutter" />
                <div className="grid grid-cols-7 flex-1">
                    {days.map((day, index) => (
                        <div key={index} className="text-center py-2">
                            <span className={day.isToday ? 'font-bold text-primary' : 'font-medium'}>
                                {day.date.format('ddd D')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
                <div className="flex">
                    <div className="week-grid-gutter">
                        {HOURS.map((hour) => (
                            <div key={hour} className="h-10 md:h-12">
                                {hour}:00
                            </div>
                        ))}
                    </div>
                    <div className="relative grid grid-cols-7 flex-1">
                        {days.map((day, index) => (
                            <WeekDayColumn
                                key={index}
                                day={day}
                                now={now}
                                onEventClick={onEventClick}
                                onCellClick={onCellClick}
                            />
                        ))}
                        {showCurrentTime && (
                            <div
                                className="absolute inset-x-0 h-0.5 bg-red-500 pointer-events-none z-10"
                                style={{ top: `${nowPercent}%` }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
