import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { type Event } from '../types/event'
import WeekView from './WeekView'
import eventsReducer from '../store/eventsSlice'

const createMockStore = (events: Event[] = []) =>
  configureStore({
    reducer: {
      events: eventsReducer,
    },
    preloadedState: {
      events: {
        items: events,
        loading: false,
        error: null,
      },
    },
  })

describe('WeekView component', () => {
  const currentDate = dayjs('2026-06-15') // Monday, in the past relative to any real run date; week runs Sun 06-14 .. Sat 06-20

  const renderWeek = (events: Event[] = [], onEventClick = jest.fn(), onCellClick = jest.fn(), date = currentDate) => {
    const store = createMockStore(events)
    const utils = render(
      <Provider store={store}>
        <WeekView currentDate={date} onEventClick={onEventClick} onCellClick={onCellClick} />
      </Provider>
    )
    return { ...utils, onEventClick, onCellClick }
  }

  test('renders a 7x24 grid of hour cells', () => {
    const { container } = renderWeek()
    expect(container.querySelectorAll('.week-grid-day-column')).toHaveLength(7)
    expect(container.querySelectorAll('.week-grid-hour-cell')).toHaveLength(7 * 24)
  })

  test('clicking an hour cell in a future week calls onCellClick with the matching day and hour', () => {
    const futureWeek = dayjs().add(2, 'week')
    const { container, onCellClick } = renderWeek([], jest.fn(), jest.fn(), futureWeek)
    const dayColumns = container.querySelectorAll('.week-grid-day-column')
    const tuesdayColumn = dayColumns[2] // Sun=0 .. Tue=2
    const hourCells = tuesdayColumn.querySelectorAll('.week-grid-hour-cell')

    fireEvent.click(hourCells[5])

    expect(onCellClick).toHaveBeenCalledTimes(1)
    const [date, hour] = onCellClick.mock.calls[0]
    expect(date.isSame(futureWeek.startOf('week').add(2, 'day'), 'day')).toBe(true)
    expect(hour).toBe(5)
  })

  test('does not call onCellClick when clicking an hour cell on a past day', () => {
    const { container, onCellClick } = renderWeek()
    const dayColumns = container.querySelectorAll('.week-grid-day-column')
    const hourCells = dayColumns[2].querySelectorAll('.week-grid-hour-cell')

    fireEvent.click(hourCells[5])

    expect(onCellClick).not.toHaveBeenCalled()
  })

  test('applies the muted "past" styling instead of the clickable class on a past day', () => {
    const { container } = renderWeek()
    const firstCell = container.querySelector('.week-grid-hour-cell')
    expect(firstCell?.classList).not.toContain('week-grid-hour-cell-clickable')
    expect(firstCell?.classList).toContain('week-grid-hour-cell-past')
  })

  test('blocks past hours today but allows the current hour onward', () => {
    const onCellClick = jest.fn()
    const { container } = renderWeek([], jest.fn(), onCellClick, dayjs())
    const todayIndex = dayjs().day() // 0=Sun..6=Sat, matches column order
    const todayColumn = container.querySelectorAll('.week-grid-day-column')[todayIndex]
    const hourCells = todayColumn.querySelectorAll('.week-grid-hour-cell')

    const pastHour = Math.max(dayjs().hour() - 3, 0)
    fireEvent.click(hourCells[pastHour])
    expect(onCellClick).not.toHaveBeenCalled()

    fireEvent.click(hourCells[dayjs().hour()])
    expect(onCellClick).toHaveBeenCalledTimes(1)
  })

  test('positions an event using top/height percentages from its start/end time', () => {
    const event: Event = {
      id: 'evt-001',
      type: 'meeting',
      name: 'Design review',
      startDate: '2026-06-16T10:30:00',
      endDate: '2026-06-16T11:15:00',
    }
    const { getByTestId } = renderWeek([event])
    const badge = getByTestId('event-evt-001')
    expect(badge.style.top).toBe('43.75%')
    expect(badge.style.height).toBe('3.125%')
  })

  test('clicking an event calls onEventClick and not onCellClick', () => {
    const event: Event = {
      id: 'evt-002',
      type: 'task',
      name: 'Follow up',
      startDate: '2026-06-16T10:30:00',
      endDate: '2026-06-16T11:15:00',
    }
    const { getByTestId, onEventClick, onCellClick } = renderWeek([event])
    fireEvent.click(getByTestId('event-evt-002'))

    expect(onEventClick).toHaveBeenCalledWith(event)
    expect(onCellClick).not.toHaveBeenCalled()
  })

  test('shows the current-time indicator when the visible week includes today', () => {
    const store = createMockStore()
    const { container } = render(
      <Provider store={store}>
        <WeekView currentDate={dayjs()} onEventClick={jest.fn()} onCellClick={jest.fn()} />
      </Provider>
    )
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  test('hides the current-time indicator when the visible week does not include today', () => {
    const { container } = renderWeek()
    expect(container.querySelector('.bg-red-500')).not.toBeInTheDocument()
  })
})
