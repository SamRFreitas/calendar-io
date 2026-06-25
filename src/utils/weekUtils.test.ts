import dayjs from 'dayjs'
import { getStartOfWeek, buildWeekDays } from './weekUtils'

describe('getStartOfWeek', () => {
    test('should return Sunday for a date in the middle of the week (June 15, 2026 - Monday)', () => {
        const june152026 = dayjs('2026-06-15')
        const result = getStartOfWeek(june152026)
        expect(result.isSame(dayjs('2026-06-14'), 'day')).toBe(true)
    })

    test('should return the same day if the date is Sunday (June 14, 2026)', () => {
        const june142026 = dayjs('2026-06-14')
        const result = getStartOfWeek(june142026)
        expect(result.isSame(june142026, 'day')).toBe(true)
    })

    test('should handle month boundaries correctly (June 30, 2026 - Tuesday)', () => {
        const june302026 = dayjs('2026-06-30')
        const result = getStartOfWeek(june302026)
        expect(result.isSame(dayjs('2026-06-28'), 'day')).toBe(true)
    })

    test('should handle year boundaries correctly (January 1, 2026 - Thursday)', () => {
        const january12026 = dayjs('2026-01-01')
        const result = getStartOfWeek(january12026)
        expect(result.isSame(dayjs('2025-12-28'), 'day')).toBe(true)
    })
})

describe('buildWeekDays', () => {
    test('should return 7 days from Sunday to Saturday for a week in June 2026', () => {
        const june152026 = dayjs('2026-06-15') // Monday
        const result = buildWeekDays(june152026)

        expect(result).toHaveLength(7)
        expect(result[0].date.isSame(dayjs('2026-06-14'), 'day')).toBe(true)
        expect(result[1].date.isSame(dayjs('2026-06-15'), 'day')).toBe(true)
        expect(result[2].date.isSame(dayjs('2026-06-16'), 'day')).toBe(true)
        expect(result[3].date.isSame(dayjs('2026-06-17'), 'day')).toBe(true)
        expect(result[4].date.isSame(dayjs('2026-06-18'), 'day')).toBe(true)
        expect(result[5].date.isSame(dayjs('2026-06-19'), 'day')).toBe(true)
        expect(result[6].date.isSame(dayjs('2026-06-20'), 'day')).toBe(true)
    })

    test('should set isCurrentMonth correctly for a week entirely within June 2026', () => {
        const june152026 = dayjs('2026-06-15')
        const result = buildWeekDays(june152026)

        result.forEach((day) => {
            expect(day.isCurrentMonth).toBe(true)
        })
    })

    test('should set isCurrentMonth correctly at month boundary (June 30, 2026 - Tuesday)', () => {
        const june302026 = dayjs('2026-06-30')
        const result = buildWeekDays(june302026)

        expect(result[0].isCurrentMonth).toBe(true) // 28 Jun
        expect(result[1].isCurrentMonth).toBe(true) // 29 Jun
        expect(result[2].isCurrentMonth).toBe(true) // 30 Jun
        expect(result[3].isCurrentMonth).toBe(false) // 1 Jul
        expect(result[4].isCurrentMonth).toBe(false) // 2 Jul
        expect(result[5].isCurrentMonth).toBe(false) // 3 Jul
        expect(result[6].isCurrentMonth).toBe(false) // 4 Jul
    })

    test('should mark isToday correctly for the current week', () => {
        const today = dayjs()
        const result = buildWeekDays(today)

        result.forEach((day) => {
            if (day.date.isSame(today, 'day')) {
                expect(day.isToday).toBe(true)
            } else {
                expect(day.isToday).toBe(false)
            }
        })
    })

    test('should return the same week for any date within that week (June 14-20, 2026)', () => {
        const june142026 = dayjs('2026-06-14') // Sunday
        const june182026 = dayjs('2026-06-18') // Thursday

        const resultFromSunday = buildWeekDays(june142026)
        const resultFromThursday = buildWeekDays(june182026)

        expect(
            resultFromSunday[0].date.isSame(resultFromThursday[0].date, 'day'),
        ).toBe(true)
        expect(
            resultFromSunday[6].date.isSame(resultFromThursday[6].date, 'day'),
        ).toBe(true)
    })

    test('should handle year-end boundary (December 31, 2026 - Thursday)', () => {
        const december312026 = dayjs('2026-12-31')
        const result = buildWeekDays(december312026)

        expect(result[0].date.isSame(dayjs('2026-12-27'), 'day')).toBe(true)
        expect(result[6].date.isSame(dayjs('2027-01-02'), 'day')).toBe(true)

        expect(result[0].isCurrentMonth).toBe(true) // 27 Dec 2026
        expect(result[6].isCurrentMonth).toBe(false) // 2 Jan 2027
    })

    test('should handle a week that crosses into the next month (July 1, 2026 - Wednesday)', () => {
        const july12026 = dayjs('2026-07-01')
        const result = buildWeekDays(july12026)

        expect(result).toHaveLength(7)
        expect(result[0].isCurrentMonth).toBe(false) // 28 Jun 2026
        expect(result[3].isCurrentMonth).toBe(true) // 1 Jul 2026
        expect(result[6].isCurrentMonth).toBe(true) // 4 Jul 2026
    })
})
