import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './eventsSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
    reducer: {
        events: eventsReducer,
        ui: uiReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
