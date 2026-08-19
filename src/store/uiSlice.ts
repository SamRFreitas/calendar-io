import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { type Event } from '../types/event'

interface UiState {
    viewType: 'month' | 'week'
    currentDate: Dayjs
    isModalOpen: boolean
    editingEvent: Event | null
}

const initialState: UiState = {
    viewType: 'month',
    currentDate: dayjs(),
    isModalOpen: false,
    editingEvent: null,
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
    },
})

export const { setViewType, setCurrentDate, openModal, closeModal, setEditingEvent } = uiSlice.actions

export default uiSlice.reducer