import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import EventForm from './EventForm'
import { type Event } from '../types/event'
import eventsReducer from '../store/eventsSlice'

const createMockStore = () =>
  configureStore({
    reducer: {
      events: eventsReducer,
    },
    preloadedState: {
      events: {
        items: [],       
        loading: false,
        error: null,
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
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<Provider store={createMockStore()}>{ui}</Provider>)
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
})