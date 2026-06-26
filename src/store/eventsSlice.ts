import {
    createSlice,
    type PayloadAction,
    createSelector,
} from '@reduxjs/toolkit'
import { type Event } from '../types/event'

interface EventsState {
    items: Event[]
}

const saveToLocalStorage = (items: Event[]) => {
    try {
        localStorage.setItem('events', JSON.stringify(items))
    } catch (error) {
        console.error('Failed to save events to localStorage:', error)
    }
}

const loadFromLocalStorage = (): Event[] => {
    try {
        const stored = localStorage.getItem('events')
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Failed to load events from localStorage:', error)
    }
    return []
}

const initialState: EventsState = {
    items: loadFromLocalStorage(),
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        addEvent: (state, action: PayloadAction<Event>) => {
            state.items.push(action.payload)
            saveToLocalStorage(state.items)
        },
        updateEvent: (state, action: PayloadAction<Event>) => {
            const index = state.items.findIndex(
                (e) => e.id === action.payload.id,
            )
            if (index !== -1) {
                state.items[index] = action.payload
                saveToLocalStorage(state.items)
            }
        },
        deleteEvent: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((e) => e.id !== action.payload)
            saveToLocalStorage(state.items)
        },
    },
})

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions
export default eventsSlice.reducer

export const selectEvents = (state: any) => state.events.items

export const selectEventsByDate = (date: string) =>
    createSelector([selectEvents], (events) =>
        events.filter((event: Event) => event.startDate.startsWith(date)),
    )
