import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { type Event } from '../types/event'

export type Theme = 'light' | 'dark'

const saveThemeToLocalStorage = (theme: Theme) => {
    try {
        localStorage.setItem('theme', theme)
    } catch (error) {
        console.error('Failed to save theme to localStorage:', error)
    }
}

const loadThemeFromLocalStorage = (): Theme => {
    try {
        const stored = localStorage.getItem('theme')
        if (stored === 'light' || stored === 'dark') {
            return stored
        }
    } catch (error) {
        console.error('Failed to load theme from localStorage:', error)
    }
    return 'light'
}

interface UiState {
    viewType: 'month' | 'week'
    currentDate: string
    isModalOpen: boolean
    editingEvent: Event | null
    theme: Theme
    viewingDayEvents: string | null
    newEventDate: string | null
}

const initialState: UiState = {
    viewType: 'month',
    currentDate: dayjs().toISOString(),
    isModalOpen: false,
    editingEvent: null,
    theme: loadThemeFromLocalStorage(),
    viewingDayEvents: null,
    newEventDate: null,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setViewType: (state, action: PayloadAction<'month' | 'week'>) => {
            state.viewType = action.payload
        },
        setCurrentDate: (state, action: PayloadAction<string>) => {
            state.currentDate = action.payload
        },
        openModal: (state, action: PayloadAction<string | undefined>) => {
            state.isModalOpen = true
            state.newEventDate = action.payload ?? null
        },
        closeModal: (state) => {
            state.isModalOpen = false
            state.newEventDate = null
        },
        setEditingEvent: (state, action: PayloadAction<Event | null>) => {
            state.editingEvent = action.payload
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
            saveThemeToLocalStorage(action.payload)
        },
        openDayEvents: (state, action: PayloadAction<string>) => {
            state.viewingDayEvents = action.payload
        },
        closeDayEvents: (state) => {
            state.viewingDayEvents = null
        },
    },
})

export const { setViewType, setCurrentDate, openModal, closeModal, setEditingEvent, setTheme, openDayEvents, closeDayEvents } = uiSlice.actions

export default uiSlice.reducer