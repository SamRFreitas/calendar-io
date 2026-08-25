import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addEvent } from '../store/eventsSlice'
import { type Event } from '../types/event'

export function useLoadEvents() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasError, setHasError] = useState(false)
    const hasLoaded = useRef(false)

    const loadEvents = useCallback(async () => {
        setLoading(true)
        setHasError(false)
        setError(null)

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

            setLoading(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError(message)
            setHasError(true)
            setLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        if (hasLoaded.current) return
        hasLoaded.current = true
        loadEvents()
    }, [loadEvents])

    return { loading, error, hasError, retry: loadEvents }
}