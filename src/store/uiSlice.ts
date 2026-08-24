import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Dayjs } from 'dayjs'
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
    currentDate: Dayjs
    isModalOpen: boolean
    editingEvent: Event | null
    theme: Theme
}

const initialState: UiState = {
    viewType: 'month',
    currentDate: dayjs(),
    isModalOpen: false,
    editingEvent: null,
    theme: loadThemeFromLocalStorage(),
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setViewType: (state, action: PayloadAction<'month' | 'week'>) => {
            state.viewType = action.payload
        },
        setCurrentDate: (state, action: PayloadAction<Dayjs>) => {
            state.currentDate = action.payload
        },
        openModal: (state) => {
            state.isModalOpen = true
        },
        closeModal: (state) => {
            state.isModalOpen = false
        },
        setEditingEvent: (state, action: PayloadAction<Event | null>) => {
            state.editingEvent = action.payload
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
            saveThemeToLocalStorage(action.payload)
        },
    },
})

export const { setViewType, setCurrentDate, openModal, closeModal, setEditingEvent, setTheme } = uiSlice.actions

export default uiSlice.reducer