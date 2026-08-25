import dayjs from 'dayjs'
import { type Event } from '../types/event'
import { type Day } from '../types/day'

export function createDay(
    date: dayjs.Dayjs,
    isCurrentMonth: boolean,
    today: dayjs.Dayjs,
): Day {
    return {
        date,
        dayOfMonth: date.date(),
        isCurrentMonth,
        ...(isCurrentMonth && { isToday: date.isSame(today, 'day') }),
    }
}

/**
 * Formats a date range string for display based on events.
 * @param events - Array of events with startDate/endDate
 * @returns Formatted string like "Jun 15" or "Jun 15 - Jun 16"
 */
export function formatDateRange(events: Event[]): string {
    if (events.length === 0) return ''

    const start = dayjs(events[0].startDate)
    const end = dayjs(events[events.length - 1].endDate)

    if (start.isSame(end, 'day')) {
        return start.format('MMM D')
    }

    return `${start.format('MMM D')} - ${end.format('MMM D')}`
}

/**
 * Checks if a date string falls within a given date range (inclusive).
 * @param dateStr - Date string to check (YYYY-MM-DD or ISO format)
 * @param startStr - Start of range (YYYY-MM-DD or ISO format)
 * @param endStr - End of range (YYYY-MM-DD or ISO format)
 * @returns True if date is within range (inclusive)
 */
export function isDateInRange(
    dateStr: string,
    startStr: string,
    endStr: string,
): boolean {
    const date = dayjs(dateStr)
    const start = dayjs(startStr).startOf('day')
    const end = dayjs(endStr).endOf('day')
    return date.isAfter(start, 'day') || date.isSame(start, 'day')
        && date.isBefore(end, 'day') || date.isSame(end, 'day')
}

/**
 * Filters events for a specific week based on a week start date.
 * @param events - Array of events to filter
 * @param weekStart - Week start date in YYYY-MM-DD format
 * @returns Events that fall within the week
 */
export function getEventsForWeek(events: Event[], weekStart: string): Event[] {
    const weekEnd = dayjs(weekStart).add(6, 'day').endOf('day')
    return events.filter((event) => {
        const eventStart = dayjs(event.startDate).startOf('day')
        const eventEnd = dayjs(event.endDate).endOf('day')
        return eventStart.isBefore(weekEnd) && eventEnd.isAfter(dayjs(weekStart).startOf('day'))
    })
}

const MINUTES_PER_DAY = 1440
const MIN_HEIGHT_PERCENT = 1.5

export interface EventSegment {
    topPercent: number
    heightPercent: number
    continuesAfter: boolean
    continuesBefore: boolean
}

/**
 * Computes the vertical position/height (as % of a 24h column) of an event's
 * portion that falls within a given day, clamped to that day's boundaries.
 * Returns null if the event doesn't touch the day at all.
 */
export function getEventSegmentForDay(event: Event, day: dayjs.Dayjs): EventSegment | null {
    const dayStart = day.startOf('day')
    const dayEnd = day.endOf('day')
    const eventStart = dayjs(event.startDate)
    const eventEnd = dayjs(event.endDate)

    if (eventEnd.isBefore(dayStart) || eventStart.isAfter(dayEnd)) return null

    const segmentStart = eventStart.isBefore(dayStart) ? dayStart : eventStart
    const segmentEnd = eventEnd.isAfter(dayEnd) ? dayEnd : eventEnd
    const startMinutes = segmentStart.diff(dayStart, 'minute')
    const endMinutes = segmentEnd.diff(dayStart, 'minute')

    return {
        topPercent: (startMinutes / MINUTES_PER_DAY) * 100,
        heightPercent: Math.max(((endMinutes - startMinutes) / MINUTES_PER_DAY) * 100, MIN_HEIGHT_PERCENT),
        continuesAfter: eventEnd.isAfter(dayEnd),
        continuesBefore: eventStart.isBefore(dayStart),
    }
}