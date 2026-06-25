import dayjs from 'dayjs'
import { createDay } from './dateHelpers'

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
