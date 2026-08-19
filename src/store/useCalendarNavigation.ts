import { useState } from 'react'
import dayjs from 'dayjs'
import { useAppDispatch } from '@/store/hooks'
import { setCurrentDate as uiSetCurrentDate } from '@/store/uiSlice'

/**
 * Hook that encapsulates calendar navigation state and logic.
 * Returns current date, view type, and navigation functions.
 * 
 * @param initialDate - Initial date for the calendar view
 * @returns [currentDate, setCurrentDate, viewType, setViewType, goPrev, goNext, goToday]
 */
export function useCalendarNavigation(initialDate: dayjs.Dayjs) {
    const dispatch = useAppDispatch()
    const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(initialDate)
    const [viewType, setViewType] = useState<'month' | 'week'>('month')

    const goPrev = () => {
        const unit = viewType === 'week' ? 'week' : 'month'
        const newDate = currentDate.subtract(1, unit)
        setCurrentDate(newDate)
        dispatch(uiSetCurrentDate(newDate))
    }

    const goNext = () => {
        const unit = viewType === 'week' ? 'week' : 'month'
        const newDate = currentDate.add(1, unit)
        setCurrentDate(newDate)
        dispatch(uiSetCurrentDate(newDate))
    }

    const goToday = () => {
        const today = dayjs()
        setCurrentDate(today)
        dispatch(uiSetCurrentDate(today))
    }

    return [currentDate, setCurrentDate, viewType, setViewType, goPrev, goNext, goToday] as const
}