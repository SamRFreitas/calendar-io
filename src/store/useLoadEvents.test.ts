import { renderHook, waitFor } from '@testing-library/react'
import { useLoadEvents } from './useLoadEvents'
import { addEvent } from './eventsSlice'
import { type Event } from '../types/event'
import * as redux from 'react-redux'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}))

describe('useLoadEvents', () => {
    const mockDispatch = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        ;(redux.useDispatch as any).mockReturnValue(mockDispatch)
        window.fetch = jest.fn()
    })

    it('should load events and dispatch addEvent for each event', async () => {
        const mockEvents: Event[] = [
            {
                id: '1',
                type: 'meeting',
                name: 'Event 1',
                startDate: '2026-06-22T09:00:00',
                endDate: '2026-06-22T09:30:00',
            },
            {
                id: '2',
                type: 'meeting',
                name: 'Event 2',
                startDate: '2026-06-23T10:00:00',
                endDate: '2026-06-23T11:00:00',
            },
        ]

        ;(window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockEvents),
        })

        const { result } = renderHook(() => useLoadEvents())

        expect(result.current.loading).toBe(true)
        expect(result.current.error).toBe(null)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(mockDispatch).toHaveBeenCalledTimes(mockEvents.length)
        expect(mockDispatch).toHaveBeenCalledWith(addEvent(mockEvents[0]))
        expect(mockDispatch).toHaveBeenCalledWith(addEvent(mockEvents[1]))
    })

    it('should set error when fetch fails', async () => {
        ;(window.fetch as jest.Mock).mockRejectedValueOnce(
            new Error('Network error'),
        )

        const { result } = renderHook(() => useLoadEvents())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.error).toBe('Network error')
        })

        expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should set error when response is not ok', async () => {
        ;(window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
        })

        const { result } = renderHook(() => useLoadEvents())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.error).toBe('Failed to fetch events: 404')
        })

        expect(mockDispatch).not.toHaveBeenCalled()
    })
})
