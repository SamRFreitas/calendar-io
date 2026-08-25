import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { type Event } from '../types/event'
import Day from './Day'
import { type ScheduleType } from '../types/schedule'
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

describe('Day component', () => {
  const today = dayjs('2026-06-15')

  const mockEvent: Event = {
    id: 'evt-001',
    type: 'meeting',
    name: 'Weekly briefing',
    startDate: '2026-06-15T09:00:00',
    endDate: '2026-06-15T09:30:00',
  }

  const renderDay = (props: any = {}, events: Event[] = [mockEvent]) => {
    const defaultProps = {
      day: {
        date: today,
        dayOfMonth: 15,
        isCurrentMonth: true,
        isToday: today.isSame(today, 'day'),
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
      ...props,
    }
    const store = createMockStore(events)
    return render(
      <Provider store={store}>
        <Day {...defaultProps} />
      </Provider>
    )
  }

  test('renders day with correct date', () => {
    const { container } = renderDay()
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement).toBeInTheDocument()
  })

  test('applies otherMonth classes when isCurrentMonth is false', () => {
    const dayProps = {
      day: {
        date: dayjs('2026-05-31'),
        dayOfMonth: 31,
        isCurrentMonth: false,
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
    }
    const { container } = renderDay(dayProps)
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement?.classList).toContain('opacity-0')
    expect(dayElement?.classList).toContain('pointer-events-none')
  })

  test('applies today class when isToday is true', () => {
    const dayProps = {
      day: {
        date: today,
        dayOfMonth: 15,
        isCurrentMonth: true,
        isToday: true,
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
    }
    const { container } = renderDay(dayProps)
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement?.classList).toContain('calendar-day-today')
  })

  test('sorts events by start time', () => {
    const event2: Event = {
      id: 'evt-002',
      type: 'task',
      name: 'Later event',
      startDate: '2026-06-15T14:00:00',
      endDate: '2026-06-15T15:00:00',
    }
    const { container } = renderDay({}, [mockEvent, event2])
    const eventBadges = container.querySelectorAll('.event-badge')
    expect(eventBadges[0].textContent).toBe('Weekly briefing')
    expect(eventBadges[1].textContent).toBe('Later event')
  })

  test('renders event badges with data-testid', () => {
    const { container } = renderDay()
    const eventBadge = container.querySelector('[data-testid="event-evt-001"]')
    expect(eventBadge).toBeInTheDocument()
    expect(eventBadge?.textContent).toBe('Weekly briefing')
  })

  test('renders week view with month span', () => {
    const dayProps = {
      day: {
        date: today,
        dayOfMonth: 15,
        isCurrentMonth: true,
      } as const,
      view: 'week' as ScheduleType,
      onEventClick: jest.fn(),
    }
    const { container } = renderDay(dayProps)
    const monthSpan = container.querySelector('.absolute.top-1.left-1')
    expect(monthSpan).toBeInTheDocument()
    expect(monthSpan?.textContent).toBe('Jun')
  })

  test('applies past day styling when not current month and not today', () => {
    const pastDayProps = {
      day: {
        date: dayjs('2026-06-10'),
        dayOfMonth: 10,
        isCurrentMonth: true,
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
    }
    const { container } = renderDay(pastDayProps)
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement?.classList).toContain('bg-muted')
    expect(dayElement?.classList).toContain('text-muted-foreground')
  })

  test('applies hover affordance and fires onDayClick for a future, current-month day', () => {
    const onDayClick = jest.fn()
    const futureDayProps = {
      day: {
        date: dayjs().add(3, 'day'),
        dayOfMonth: dayjs().add(3, 'day').date(),
        isCurrentMonth: true,
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
      onDayClick,
    }
    const { container } = renderDay(futureDayProps)
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement?.classList).toContain('calendar-day-hover')

    dayElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onDayClick).toHaveBeenCalledTimes(1)
  })

  test('does not apply hover affordance and does not fire onDayClick for a past day', () => {
    const onDayClick = jest.fn()
    const pastDayProps = {
      day: {
        date: dayjs().subtract(1, 'day'),
        dayOfMonth: dayjs().subtract(1, 'day').date(),
        isCurrentMonth: true,
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
      onDayClick,
    }
    const { container } = renderDay(pastDayProps)
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement?.classList).not.toContain('calendar-day-hover')

    dayElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onDayClick).not.toHaveBeenCalled()
  })

  test('does not apply hover affordance for an other-month day', () => {
    const dayProps = {
      day: {
        date: dayjs('2026-05-31'),
        dayOfMonth: 31,
        isCurrentMonth: false,
      } as const,
      view: 'month' as ScheduleType,
      onEventClick: jest.fn(),
      onDayClick: jest.fn(),
    }
    const { container } = renderDay(dayProps)
    const dayElement = container.querySelector('.calendar-day')
    expect(dayElement?.classList).not.toContain('calendar-day-hover')
  })

  describe('on mobile widths', () => {
    const originalInnerWidth = window.innerWidth

    beforeEach(() => {
      window.innerWidth = 375
    })

    afterEach(() => {
      window.innerWidth = originalInnerWidth
    })

    test('tapping a past day does nothing, same as on desktop', () => {
      const onDayClick = jest.fn()
      const onShowMore = jest.fn()
      const pastDayProps = {
        day: {
          date: dayjs().subtract(1, 'day'),
          dayOfMonth: dayjs().subtract(1, 'day').date(),
          isCurrentMonth: true,
        } as const,
        view: 'month' as ScheduleType,
        onEventClick: jest.fn(),
        onDayClick,
        onShowMore,
      }
      const { container } = renderDay(pastDayProps)
      const dayElement = container.querySelector('.calendar-day')
      dayElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(onShowMore).not.toHaveBeenCalled()
      expect(onDayClick).not.toHaveBeenCalled()
    })

    test('tapping a past day that has events still opens the day list (events stay reachable)', () => {
      const onDayClick = jest.fn()
      const onShowMore = jest.fn()
      const pastDate = dayjs().subtract(1, 'day')
      const pastEvent: Event = {
        id: 'evt-past',
        type: 'meeting',
        name: 'Old briefing',
        startDate: pastDate.format('YYYY-MM-DD') + 'T09:00:00',
        endDate: pastDate.format('YYYY-MM-DD') + 'T09:30:00',
      }
      const pastDayProps = {
        day: {
          date: pastDate,
          dayOfMonth: pastDate.date(),
          isCurrentMonth: true,
        } as const,
        view: 'month' as ScheduleType,
        onEventClick: jest.fn(),
        onDayClick,
        onShowMore,
      }
      const { container } = renderDay(pastDayProps, [pastEvent])
      const dayElement = container.querySelector('.calendar-day')
      dayElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(onShowMore).toHaveBeenCalledTimes(1)
      expect(onDayClick).not.toHaveBeenCalled()
    })

    test('tapping a future day opens the day list instead of the create form', () => {
      const onDayClick = jest.fn()
      const onShowMore = jest.fn()
      const futureDayProps = {
        day: {
          date: dayjs().add(3, 'day'),
          dayOfMonth: dayjs().add(3, 'day').date(),
          isCurrentMonth: true,
        } as const,
        view: 'month' as ScheduleType,
        onEventClick: jest.fn(),
        onDayClick,
        onShowMore,
      }
      const { container } = renderDay(futureDayProps)
      const dayElement = container.querySelector('.calendar-day')
      dayElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(onShowMore).toHaveBeenCalledTimes(1)
      expect(onDayClick).not.toHaveBeenCalled()
    })

    test('renders up to 4 event dots plus an overflow count', () => {
      const events: Event[] = Array.from({ length: 5 }, (_, i) => ({
        id: `evt-${i}`,
        type: i % 2 === 0 ? 'meeting' : 'task',
        name: `Event ${i}`,
        startDate: `2026-06-15T0${i}:00:00`,
        endDate: `2026-06-15T0${i}:30:00`,
      }))
      const { container } = renderDay({}, events)
      expect(container.querySelectorAll('.event-dot')).toHaveLength(4)
      expect(container.textContent).toContain('+1')
    })
  })
})