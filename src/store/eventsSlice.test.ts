import eventsReducer, {
    addEvent,
    updateEvent,
    deleteEvent,
} from './eventsSlice'
import { type Event } from '../types/event'

describe('eventsSlice - addEvent', () => {
    const mockEvent: Event = {
        id: 'evt-001',
        type: 'meeting',
        name: 'Weekly safety briefing',
        startDate: '2026-06-22T09:00:00',
        endDate: '2026-06-22T09:30:00',
    }

    it('should add a new event to an empty list', () => {
        const initialState = { items: [] }
        const action = addEvent(mockEvent)
        const newState = eventsReducer(initialState, action)

        expect(newState.items).toHaveLength(1)
        expect(newState.items[0]).toEqual(mockEvent)
    })

    it('should add a new event to an existing list', () => {
        const existingEvent = { ...mockEvent, id: 'evt-000' }
        const initialState = { items: [existingEvent] }
        const action = addEvent(mockEvent)
        const newState = eventsReducer(initialState, action)

        expect(newState.items).toHaveLength(2)
        expect(newState.items[1]).toEqual(mockEvent)
    })
})

describe('eventsSlice - updateEvent', () => {
    const mockEvent: Event = {
        id: 'evt-001',
        type: 'meeting',
        name: 'Weekly safety briefing',
        startDate: '2026-06-22T09:00:00',
        endDate: '2026-06-22T09:30:00',
    }

    it('should update an existing event', () => {
        const initialState = { items: [mockEvent] }
        const updatedEvent = { ...mockEvent, name: 'Updated briefing' }
        const action = updateEvent(updatedEvent)
        const newState = eventsReducer(initialState, action)

        expect(newState.items).toHaveLength(1)
        expect(newState.items[0].name).toBe('Updated briefing')
        expect(newState.items[0]).toEqual(updatedEvent)
    })

    it('should not update if event id is not found', () => {
        const initialState = { items: [mockEvent] }
        const unknownEvent = { ...mockEvent, id: 'unknown-id' }
        const action = updateEvent(unknownEvent)
        const newState = eventsReducer(initialState, action)

        expect(newState.items).toHaveLength(1)
        expect(newState.items[0]).toEqual(mockEvent)
    })
})

describe('eventsSlice - deleteEvent', () => {
    const mockEvent: Event = {
        id: 'evt-001',
        type: 'meeting',
        name: 'Weekly safety briefing',
        startDate: '2026-06-22T09:00:00',
        endDate: '2026-06-22T09:30:00',
    }

    it('should delete an existing event', () => {
        const initialState = { items: [mockEvent] }
        const action = deleteEvent(mockEvent.id)
        const newState = eventsReducer(initialState, action)
        expect(newState.items).toHaveLength(0)
    })

    it('should not delete if event id is not found', () => {
        const initialState = { items: [mockEvent] }
        const action = deleteEvent('unknown-id')
        const newState = eventsReducer(initialState, action)
        expect(newState.items).toHaveLength(1)
        expect(newState.items[0]).toEqual(mockEvent)
    })

    it('should delete the correct event when multiple events exist', () => {
        const event1 = { ...mockEvent, id: 'evt-001' }
        const event2 = { ...mockEvent, id: 'evt-002', name: 'Another event' }
        const initialState = { items: [event1, event2] }
        const action = deleteEvent('evt-001')
        const newState = eventsReducer(initialState, action)
        expect(newState.items).toHaveLength(1)
        expect(newState.items[0].id).toBe('evt-002')
    })
})
