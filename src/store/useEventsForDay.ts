import { useSelector } from 'react-redux'
import { selectEventsByDate } from './eventsSlice'

/**
 * Hook that provides event filtering for a specific day.
 * Returns filtered events based on the date selector.
 * 
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Filtered events array
 */
export function useEventsForDay(dateStr: string) {
    return useSelector(selectEventsByDate(dateStr))
}