import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addEvent } from './eventsSlice'
import { type Event } from '../types/event'

export function useLoadEvents() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const hasLoaded = useRef(false) // controle para evitar duplicação

    useEffect(() => {
        if (hasLoaded.current) return
        hasLoaded.current = true

        const loadEvents = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))
                const response = await fetch('/events.json')
                if (!response.ok) {
                    throw new Error('Failed to fetch events')
                }

                const data: Event[] = await response.json()

                data.forEach((event) => {
                    dispatch(addEvent(event))
                })

                setLoading(false)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                setLoading(false)
            }
        }

        loadEvents()
    }, [dispatch])

    return { loading, error }
}
