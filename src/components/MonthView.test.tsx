import { buildMonthDays } from '../utils'
import dayjs from 'dayjs'

describe('buildMonthDays utility', () => {
    test('returns 28 days for February 2026 (non-leap, starts on Sunday)', () => {
        const result = buildMonthDays(dayjs('2026-02-01'))
        expect(result).toHaveLength(28)
        expect(result.filter((d) => d.isCurrentMonth)).toHaveLength(28)
        expect(result.filter((d) => !d.isCurrentMonth)).toHaveLength(0)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[0].date.isSame(dayjs('2026-02-01'), 'day')).toBe(true)
        expect(result[27].dayOfMonth).toBe(28)
        expect(result[27].date.isSame(dayjs('2026-02-28'), 'day')).toBe(true)
    })

    test('returns 35 days for June 2026 (starts on Monday)', () => {
        const result = buildMonthDays(dayjs('2026-06-01'))
        expect(result).toHaveLength(35)
        expect(result.filter((d) => d.isCurrentMonth)).toHaveLength(30)
        expect(result.filter((d) => !d.isCurrentMonth)).toHaveLength(5)
        expect(result[0].dayOfMonth).toBe(31)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[0].date.isSame(dayjs('2026-05-31'), 'day')).toBe(true)
        expect(result[1].dayOfMonth).toBe(1)
        expect(result[1].isCurrentMonth).toBe(true)
        expect(result[1].date.isSame(dayjs('2026-06-01'), 'day')).toBe(true)
        expect(result[30].dayOfMonth).toBe(30)
        expect(result[30].isCurrentMonth).toBe(true)
        expect(result[30].date.isSame(dayjs('2026-06-30'), 'day')).toBe(true)
        expect(result[34].dayOfMonth).toBe(4)
        expect(result[34].isCurrentMonth).toBe(false)
        expect(result[34].date.isSame(dayjs('2026-07-04'), 'day')).toBe(true)
    })

    test('returns 42 days for August 2026 (starts on Saturday)', () => {
        const result = buildMonthDays(dayjs('2026-08-01'))
        expect(result).toHaveLength(42)
        expect(result.filter((d) => d.isCurrentMonth)).toHaveLength(31)
        expect(result.filter((d) => !d.isCurrentMonth)).toHaveLength(11)
        expect(result[0].dayOfMonth).toBe(26)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[0].date.isSame(dayjs('2026-07-26'), 'day')).toBe(true)
        expect(result[6].dayOfMonth).toBe(1)
        expect(result[6].isCurrentMonth).toBe(true)
        expect(result[6].date.isSame(dayjs('2026-08-01'), 'day')).toBe(true)
        expect(result[36].dayOfMonth).toBe(31)
        expect(result[36].isCurrentMonth).toBe(true)
        expect(result[36].date.isSame(dayjs('2026-08-31'), 'day')).toBe(true)
        expect(result[41].dayOfMonth).toBe(5)
        expect(result[41].isCurrentMonth).toBe(false)
        expect(result[41].date.isSame(dayjs('2026-09-05'), 'day')).toBe(true)
    })

    test('correctly identifies current month days', () => {
        const result = buildMonthDays(dayjs('2026-06-15'))
        const today = dayjs()
        result.forEach((day) => {
            if (day.isCurrentMonth) {
                expect(day.isToday).toBe(day.date.isSame(today, 'day'))
            }
        })
    })

    test('handles January start correctly - 35 days total', () => {
        const result = buildMonthDays(dayjs('2026-01-01'))
        expect(result).toHaveLength(35)
        expect(result.filter((d) => d.isCurrentMonth)).toHaveLength(31)
        expect(result.filter((d) => !d.isCurrentMonth)).toHaveLength(4)
        // First few days are from previous month (December)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[4].isCurrentMonth).toBe(true)
        expect(result[34].isCurrentMonth).toBe(true)
    })
})