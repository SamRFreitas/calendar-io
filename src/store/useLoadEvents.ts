import { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { addEvent } from '../store/eventsSlice'
import { type Event } from '../types/event'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export function useLoadEvents() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasError, setHasError] = useState(false)
    const hasLoaded = useRef(false)
    const cacheRef = useRef<Map<string, { events: Event[], timestamp: number }>>(new Map())

    useEffect(() => {
        if (hasLoaded.current) return
        hasLoaded.current = true

        const loadEvents = async () => {
            try {
                const stored = localStorage.getItem('events')

                if (stored) {
                    setLoading(false)
                    return
                }

                await new Promise((resolve) => setTimeout(resolve, 500))
                const response = await fetch('/events.json')

                if (!response.ok) {
                    throw new Error('Failed to fetch events: ' + response.status)
                }

                const data: Event[] = await response.json()
                data.forEach((event) => {
                    dispatch(addEvent(event))
                })

                // Cache the fetched events keyed by current month string
                const monthKey = dayjs().format('YYYY-MM')
                cacheRef.current.set(monthKey, { events: data, timestamp: Date.now() })

                setLoading(false)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error'
                setError(message)
                setHasError(true)
                setLoading(false)
            }
        }

        loadEvents()
    }, [dispatch])

    // Check if cached data for the current month is stale
    const currentMonthKey = dayjs().format('YYYY-MM')
    const cached = cacheRef.current.get(currentMonthKey)
    const isStale = cached ? Date.now() - cached.timestamp > STALE_TIME : true
    const shouldRefresh = isStale && hasLoaded.current

    return { loading, error, hasError, shouldRefresh }
}