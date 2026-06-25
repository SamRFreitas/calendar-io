import {
    createSlice,
    type PayloadAction,
    createSelector,
} from '@reduxjs/toolkit'
import { type Event } from '../types/event'

// Remove a importação de RootState
// import { RootState } from './index'

interface EventsState {
    items: Event[]
}

const initialState: EventsState = {
    items: [],
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        addEvent: (state, action: PayloadAction<Event>) => {
            state.items.push(action.payload)
        },
        updateEvent: (state, action: PayloadAction<Event>) => {
            const index = state.items.findIndex(
                (e) => e.id === action.payload.id,
            )
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },
        deleteEvent: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((e) => e.id !== action.payload)
        },
    },
})

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions
export default eventsSlice.reducer

// Seletores – agora usam any para evitar a importação circular
export const selectEvents = (state: any) => state.events.items

export const selectEventsByDate = (date: string) =>
    createSelector([selectEvents], (events) =>
        events.filter((event: Event) => event.startDate.startsWith(date)),
    )
