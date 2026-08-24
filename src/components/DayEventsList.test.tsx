import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { type Event } from '../types/event'
import DayEventsList from './DayEventsList'
import eventsReducer from '../store/eventsSlice'

const createMockStore = (events: Event[] = []) =>
  configureStore({
    reducer: {
      events: eventsReducer,
    },
    preloadedState: {
      events: {
        items: events,
      },
    },
  })

describe('DayEventsList component', () => {
  const mockEvents: Event[] = [
    {
      id: 'evt-001',
      type: 'meeting',
      name: 'Weekly briefing',
      startDate: '2026-06-15T09:00:00',
      endDate: '2026-06-15T09:30:00',
    },
    {
      id: 'evt-002',
      type: 'task',
      name: 'Write report',
      startDate: '2026-06-15T14:00:00',
      endDate: '2026-06-15T15:00:00',
    },
  ]

  const renderList = (events: Event[] = mockEvents, props: Partial<{ onEventClick: jest.Mock; onAddEvent: jest.Mock }> = {}) => {
    const onEventClick = props.onEventClick ?? jest.fn()
    const onAddEvent = props.onAddEvent ?? jest.fn()
    const store = createMockStore(events)
    const utils = render(
      <Provider store={store}>
        <DayEventsList date="2026-06-15" onEventClick={onEventClick} onAddEvent={onAddEvent} />
      </Provider>
    )
    return { ...utils, onEventClick, onAddEvent }
  }

  test('renders all events for the given date, sorted by start time', () => {
    const { getByText } = renderList()
    expect(getByText('Weekly briefing')).toBeInTheDocument()
    expect(getByText('Write report')).toBeInTheDocument()
  })

  test('calls onEventClick with the clicked event', () => {
    const { getByText, onEventClick } = renderList()
    fireEvent.click(getByText('Weekly briefing'))
    expect(onEventClick).toHaveBeenCalledWith(mockEvents[0])
  })

  test('calls onAddEvent when the add button is clicked', () => {
    const { getByText, onAddEvent } = renderList()
    fireEvent.click(getByText('+ Add Event'))
    expect(onAddEvent).toHaveBeenCalled()
  })
})
