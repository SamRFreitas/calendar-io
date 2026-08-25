import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import EventForm from './EventForm'
import { type Event } from '../types/event'
import eventsReducer from '../store/eventsSlice'
import uiReducer, { type Theme } from '../store/uiSlice'

const createMockStore = (newEventDate: string | null = null) =>
  configureStore({
    reducer: {
      events: eventsReducer,
      ui: uiReducer,
    },
    preloadedState: {
      events: {
        items: [],
        loading: false,
        error: null,
      },
      ui: {
        viewType: 'month' as const,
        currentDate: dayjs().toISOString(),
        isModalOpen: true,
        editingEvent: null,
        theme: 'light' as Theme,
        viewingDayEvents: null,
        newEventDate,
      },
    },
  })

const mockEvent: Event = {
  id: 'evt-001',
  type: 'meeting',
  name: 'Weekly briefing',
  startDate: '2026-06-22T09:00:00',
  endDate: '2026-06-22T09:30:00',
}

describe('EventForm component', () => {
  const renderWithProvider = (ui: React.ReactElement, newEventDate: string | null = null) => {
    return render(<Provider store={createMockStore(newEventDate)}>{ui}</Provider>)
  }

  test('renders add event form by default', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    expect(screen.getByText('Add Event')).toBeInTheDocument()
  })

  test('renders edit event form when event prop provided', () => {
    renderWithProvider(<EventForm event={mockEvent} onClose={jest.fn()} />)
    expect(screen.getByText('Edit Event')).toBeInTheDocument()
  })

  test('renders start date input', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const startInput = screen.getByTestId('event-start')
    expect(startInput).toBeInTheDocument()
  })

  test('renders end date input', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const endInput = screen.getByTestId('event-end')
    expect(endInput).toBeInTheDocument()
  })

  test('renders name input with data-testid', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const nameInput = screen.getByTestId('event-name')
    expect(nameInput).toBeInTheDocument()
  })

  test('renders type select with data-testid', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const typeSelect = screen.getByTestId('event-type')
    expect(typeSelect).toBeInTheDocument()
  })

  test('has save button with data-testid', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const saveButton = screen.getByTestId('event-save')
    expect(saveButton).toBeInTheDocument()
  })

  test('has cancel button', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  test('validates required fields structure', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const saveButton = screen.getByTestId('event-save')
    expect(saveButton).toBeInTheDocument()
  })

  test('validates end date after start date structure', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const startInput = screen.getByTestId('event-start')
    const endInput = screen.getByTestId('event-end')
    expect(startInput).toBeInTheDocument()
    expect(endInput).toBeInTheDocument()
  })

  test('validates past dates structure', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />)
    const startInput = screen.getByTestId('event-start')
    expect(startInput).toBeInTheDocument()
  })

  test('renders correctly with event prop', () => {
    renderWithProvider(<EventForm event={mockEvent} onClose={jest.fn()} />)
    expect(screen.getByText('Edit Event')).toBeInTheDocument()
  })

  test('defaults start to now and end to start+1h when creating with no newEventDate', () => {
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />, null)
    const startValue = (screen.getByTestId('event-start') as HTMLInputElement).value
    const endValue = (screen.getByTestId('event-end') as HTMLInputElement).value
    expect(startValue.slice(0, 10)).toBe(dayjs().format('YYYY-MM-DD'))
    expect(dayjs(endValue).diff(dayjs(startValue), 'minute')).toBe(60)
  })

  test('defaults start to 00:00 of a future clicked day, end 1h later', () => {
    const futureDate = dayjs().add(3, 'day').format('YYYY-MM-DD')
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />, futureDate)
    const startValue = (screen.getByTestId('event-start') as HTMLInputElement).value
    const endValue = (screen.getByTestId('event-end') as HTMLInputElement).value
    expect(startValue).toBe(`${futureDate}T00:00`)
    expect(endValue).toBe(`${futureDate}T01:00`)
  })

  test('defaults start to now (not midnight) when the clicked day is today', () => {
    const todayDate = dayjs().format('YYYY-MM-DD')
    renderWithProvider(<EventForm event={undefined} onClose={jest.fn()} />, todayDate)
    const startValue = (screen.getByTestId('event-start') as HTMLInputElement).value
    expect(startValue.slice(0, 10)).toBe(todayDate)
    expect(startValue.endsWith('T00:00')).toBe(false)
  })

  test('ignores newEventDate when editing an existing event', () => {
    const futureDate = dayjs().add(3, 'day').format('YYYY-MM-DD')
    renderWithProvider(<EventForm event={mockEvent} onClose={jest.fn()} />, futureDate)
    const startValue = (screen.getByTestId('event-start') as HTMLInputElement).value
    const endValue = (screen.getByTestId('event-end') as HTMLInputElement).value
    expect(startValue).toBe('2026-06-22T09:00')
    expect(endValue).toBe('2026-06-22T09:30')
  })
})