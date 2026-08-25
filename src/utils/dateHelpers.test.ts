import dayjs from 'dayjs'
import { createDay, getEventSegmentForDay } from './dateHelpers'
import { type Event } from '../types/event'

describe('createDay', () => {
    const june152026 = dayjs('2026-06-15')

    test('should create a Day object for a date in the current month (June 10, 2026)', () => {
        const june102026 = dayjs('2026-06-10')
        const result = createDay(june102026, true, june152026)

        expect(result).toEqual({
            date: june102026,
            dayOfMonth: 10,
            isCurrentMonth: true,
            isToday: false,
        })
    })

    test('should create a Day object for a date not in the current month (May 31, 2026)', () => {
        const may312026 = dayjs('2026-05-31')
        const result = createDay(may312026, false, june152026)

        expect(result).toEqual({
            date: may312026,
            dayOfMonth: 31,
            isCurrentMonth: false,
        })
        expect(result.isToday).toBeUndefined()
    })

    test('should set isToday to true when the date is today (June 15, 2026)', () => {
        const june152026Today = dayjs('2026-06-15')
        const result = createDay(june152026Today, true, june152026)

        expect(result).toEqual({
            date: june152026Today,
            dayOfMonth: 15,
            isCurrentMonth: true,
            isToday: true,
        })
    })

    test('should set isToday to false when the date is not today (June 14, 2026)', () => {
        const june142026 = dayjs('2026-06-14')
        const result = createDay(june142026, true, june152026)

        expect(result.isToday).toBe(false)
    })

    test('should not include isToday when isCurrentMonth is false (May 15, 2026 - same day number, different month)', () => {
        const may152026 = dayjs('2026-05-15')
        const result = createDay(may152026, false, june152026)

        expect(result.isCurrentMonth).toBe(false)
        expect(result.isToday).toBeUndefined()
    })

    test('should handle dates across year boundaries (December 31, 2025)', () => {
        const december312025 = dayjs('2025-12-31')
        const january12026 = dayjs('2026-01-01')
        const result = createDay(december312025, false, january12026)

        expect(result).toEqual({
            date: december312025,
            dayOfMonth: 31,
            isCurrentMonth: false,
        })
        expect(result.isToday).toBeUndefined()
    })

    test('should handle dates across year boundaries (January 1, 2026 - today)', () => {
        const january12026Today = dayjs('2026-01-01')
        const result = createDay(january12026Today, true, january12026Today)

        expect(result).toEqual({
            date: january12026Today,
            dayOfMonth: 1,
            isCurrentMonth: true,
            isToday: true,
        })
    })
})

describe('getEventSegmentForDay', () => {
    const day = dayjs('2026-06-15')

    const makeEvent = (startDate: string, endDate: string): Event => ({
        id: 'evt-1',
        type: 'meeting',
        name: 'Test event',
        startDate,
        endDate,
    })

    test('positions a same-day event by minutes (10:30-11:15 -> 43.75%/3.125%)', () => {
        const event = makeEvent('2026-06-15T10:30:00', '2026-06-15T11:15:00')
        const result = getEventSegmentForDay(event, day)

        expect(result).not.toBeNull()
        expect(result?.topPercent).toBeCloseTo(43.75, 5)
        expect(result?.heightPercent).toBeCloseTo(3.125, 5)
        expect(result?.continuesBefore).toBe(false)
        expect(result?.continuesAfter).toBe(false)
    })

    test('returns null for an event entirely on another day', () => {
        const event = makeEvent('2026-06-14T10:00:00', '2026-06-14T11:00:00')
        expect(getEventSegmentForDay(event, day)).toBeNull()
    })

    test('clamps a multi-day event to the end of the start day and flags continuesAfter', () => {
        const event = makeEvent('2026-06-15T22:00:00', '2026-06-16T02:00:00')
        const result = getEventSegmentForDay(event, day)

        expect(result).not.toBeNull()
        expect(result?.topPercent).toBeCloseTo((22 * 60 / 1440) * 100, 5)
        expect(result?.continuesAfter).toBe(true)
        expect(result?.continuesBefore).toBe(false)
        // segment runs from 22:00 to end of day (23:59:59.999) - just under 2h
        expect(result?.heightPercent).toBeGreaterThan(8)
        expect(result?.heightPercent).toBeLessThan(8.5)
    })

    test('clamps a multi-day event to the start of the end day and flags continuesBefore', () => {
        const event = makeEvent('2026-06-14T22:00:00', '2026-06-15T02:00:00')
        const result = getEventSegmentForDay(event, day)

        expect(result).not.toBeNull()
        expect(result?.topPercent).toBe(0)
        expect(result?.continuesBefore).toBe(true)
        expect(result?.continuesAfter).toBe(false)
        expect(result?.heightPercent).toBeCloseTo((2 * 60 / 1440) * 100, 5)
    })

    test('enforces a minimum height for very short events', () => {
        const event = makeEvent('2026-06-15T09:00:00', '2026-06-15T09:02:00')
        const result = getEventSegmentForDay(event, day)

        expect(result?.heightPercent).toBe(1.5)
    })
})
