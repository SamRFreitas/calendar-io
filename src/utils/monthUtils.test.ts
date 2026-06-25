import {
    getDaysFromPreviousMonth,
    calculateTotalDays,
    generatePreviousMonthDays,
    generateCurrentMonthDays,
    generateNextMonthDays,
    buildMonthDays,
} from './monthUtils'
import dayjs from 'dayjs'

describe('getDaysFromPreviousMonth', () => {
    test('should return 0, because month starts on Sunday', () => {
        const february2026 = dayjs('2026-02-01')
        const startDateSunday = february2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateSunday)).toBe(0)
    })

    test('should return 1, because month starts on Monday', () => {
        const june2026 = dayjs('2026-06-01')
        const startDateMonday = june2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateMonday)).toBe(1)
    })

    test('should return 2, because month starts on Tuesday', () => {
        const december2026 = dayjs('2026-12-01')
        const startDateTuesday = december2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateTuesday)).toBe(2)
    })

    test('should return 3, because month starts on Wednesday', () => {
        const april2026 = dayjs('2026-04-01')
        const startDateWednesday = april2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateWednesday)).toBe(3)
    })

    test('should return 4, because month starts on Thursday', () => {
        const january2026 = dayjs('2026-01-01')
        const startDateThursday = january2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateThursday)).toBe(4)
    })

    test('should return 5, because month starts on Friday', () => {
        const may2026 = dayjs('2026-05-01')
        const startDateFriday = may2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateFriday)).toBe(5)
    })

    test('should return 6, because month starts on Saturday', () => {
        const august2026 = dayjs('2026-08-01')
        const startDateSaturday = august2026.startOf('month')
        expect(getDaysFromPreviousMonth(startDateSaturday)).toBe(6)
    })
})

describe('calculateTotalDays', () => {
    test('should return 28 for a non-leap February (0 previous days + 28 days)', () => {
        expect(calculateTotalDays(0, 28)).toBe(28)
    })

    test('should return 28 for a leap February (0 previous days + 29 days)', () => {
        expect(calculateTotalDays(0, 29)).toBe(35)
    })

    test('should return 35 for June (1 previous day + 30 days)', () => {
        expect(calculateTotalDays(1, 30)).toBe(35)
    })

    test('should return 35 for July (3 previous days + 31 days)', () => {
        expect(calculateTotalDays(3, 31)).toBe(35)
    })

    test('should return 42 for August (6 previous days + 31 days)', () => {
        expect(calculateTotalDays(6, 31)).toBe(42)
    })

    test('should return 35 for April (4 previous days + 30 days)', () => {
        expect(calculateTotalDays(4, 30)).toBe(35)
    })

    test('should return 35 for a month with 31 days starting on Sunday (0 previous days + 31 days)', () => {
        expect(calculateTotalDays(0, 31)).toBe(35)
    })
})

describe('generatePreviousMonthDays', () => {
    const today = dayjs()

    test('should return 0 days when daysFromPrevMonth is 0', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generatePreviousMonthDays(start, 0, today)
        expect(result).toHaveLength(0)
    })

    test('should return 1 day (last day of previous month) when daysFromPrevMonth is 1', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generatePreviousMonthDays(start, 1, today)
        expect(result).toHaveLength(1)
        expect(result[0].dayOfMonth).toBe(31)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[0].date.format('YYYY-MM-DD')).toBe('2026-05-31')
    })

    test('should return 3 days (last 3 days of previous month) when daysFromPrevMonth is 3', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generatePreviousMonthDays(start, 3, today)
        expect(result).toHaveLength(3)
        expect(result[0].dayOfMonth).toBe(29)
        expect(result[1].dayOfMonth).toBe(30)
        expect(result[2].dayOfMonth).toBe(31)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[0].date.format('YYYY-MM-DD')).toBe('2026-05-29')
        expect(result[1].date.format('YYYY-MM-DD')).toBe('2026-05-30')
        expect(result[2].date.format('YYYY-MM-DD')).toBe('2026-05-31')
    })

    test('should return 6 days (last 6 days of previous month) when daysFromPrevMonth is 6', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generatePreviousMonthDays(start, 6, today)
        expect(result).toHaveLength(6)
        expect(result[0].dayOfMonth).toBe(26)
        expect(result[5].dayOfMonth).toBe(31)
        expect(result[0].date.format('YYYY-MM-DD')).toBe('2026-05-26')
        expect(result[5].date.format('YYYY-MM-DD')).toBe('2026-05-31')
    })

    test('should handle previous month with 30 days correctly (e.g., April -> May)', () => {
        const start = dayjs('2026-05-01').startOf('month')
        const result = generatePreviousMonthDays(start, 2, today)
        expect(result).toHaveLength(2)
        expect(result[0].dayOfMonth).toBe(29)
        expect(result[1].dayOfMonth).toBe(30)
        expect(result[0].date.format('YYYY-MM-DD')).toBe('2026-04-29')
        expect(result[1].date.format('YYYY-MM-DD')).toBe('2026-04-30')
    })

    test('should handle previous month with 29 days (leap year February) correctly', () => {
        const start = dayjs('2024-03-01').startOf('month')
        const result = generatePreviousMonthDays(start, 3, today)
        expect(result).toHaveLength(3)
        expect(result[0].dayOfMonth).toBe(27)
        expect(result[1].dayOfMonth).toBe(28)
        expect(result[2].dayOfMonth).toBe(29)
        expect(result[0].date.format('YYYY-MM-DD')).toBe('2024-02-27')
        expect(result[1].date.format('YYYY-MM-DD')).toBe('2024-02-28')
        expect(result[2].date.format('YYYY-MM-DD')).toBe('2024-02-29')
    })
})

describe('generateCurrentMonthDays', () => {
    const today = dayjs()

    test('should return 28 days for February 2026 (non-leap)', () => {
        const start = dayjs('2026-02-01').startOf('month')
        const result = generateCurrentMonthDays(start, 28, today)
        expect(result).toHaveLength(28)
        result.forEach((day, index) => {
            expect(day.dayOfMonth).toBe(index + 1)
            expect(day.isCurrentMonth).toBe(true)
            expect(day.date.isSame(start.date(index + 1), 'day')).toBe(true)
        })
    })

    test('should return 29 days for February 2024 (leap year)', () => {
        const start = dayjs('2024-02-01').startOf('month')
        const result = generateCurrentMonthDays(start, 29, today)
        expect(result).toHaveLength(29)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[28].dayOfMonth).toBe(29)
        result.forEach((day) => {
            expect(day.isCurrentMonth).toBe(true)
        })
    })

    test('should return 30 days for June 2026', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generateCurrentMonthDays(start, 30, today)
        expect(result).toHaveLength(30)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[29].dayOfMonth).toBe(30)
    })

    test('should return 31 days for July 2026', () => {
        const start = dayjs('2026-07-01').startOf('month')
        const result = generateCurrentMonthDays(start, 31, today)
        expect(result).toHaveLength(31)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[30].dayOfMonth).toBe(31)
    })

    test('should generate correct dates', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generateCurrentMonthDays(start, 30, today)
        for (let i = 0; i < 30; i++) {
            const expectedDate = start.date(i + 1)
            expect(result[i].date.isSame(expectedDate, 'day')).toBe(true)
        }
    })
})

describe('generateNextMonthDays', () => {
    const today = dayjs()

    test('should return 1 day for a month that needs only 1 day from next month', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generateNextMonthDays(start, 1, today)
        expect(result).toHaveLength(1)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[0].date.isSame(dayjs('2026-07-01'), 'day')).toBe(true)
    })

    test('should return 2 days when 2 days are needed from next month', () => {
        const start = dayjs('2026-05-01').startOf('month')
        const result = generateNextMonthDays(start, 2, today)
        expect(result).toHaveLength(2)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[0].date.isSame(dayjs('2026-06-01'), 'day')).toBe(true)
        expect(result[1].dayOfMonth).toBe(2)
        expect(result[1].date.isSame(dayjs('2026-06-02'), 'day')).toBe(true)
        result.forEach((day) => {
            expect(day.isCurrentMonth).toBe(false)
        })
    })

    test('should return 4 days for a month that needs 4 days from next month', () => {
        const start = dayjs('2026-07-01').startOf('month')
        const result = generateNextMonthDays(start, 4, today)
        expect(result).toHaveLength(4)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[0].date.isSame(dayjs('2026-08-01'), 'day')).toBe(true)
        expect(result[3].dayOfMonth).toBe(4)
        expect(result[3].date.isSame(dayjs('2026-08-04'), 'day')).toBe(true)
        result.forEach((day) => {
            expect(day.isCurrentMonth).toBe(false)
        })
    })

    test('should return 6 days to complete a grid of 42 days', () => {
        const start = dayjs('2026-06-01').startOf('month')
        const result = generateNextMonthDays(start, 6, today)
        expect(result).toHaveLength(6)
        for (let i = 0; i < 6; i++) {
            expect(result[i].dayOfMonth).toBe(i + 1)
            expect(
                result[i].date.isSame(dayjs('2026-07-01').add(i, 'day'), 'day'),
            ).toBe(true)
            expect(result[i].isCurrentMonth).toBe(false)
        }
    })

    test('should return an empty array when no days are needed (remainingDays = 0)', () => {
        const start = dayjs('2026-02-01').startOf('month')
        const result = generateNextMonthDays(start, 0, today)
        expect(result).toHaveLength(0)
    })
})

describe('buildMonthDays', () => {
    test('should return 28 days for February 2026 (non-leap, starts on Sunday)', () => {
        const result = buildMonthDays(dayjs('2026-02-01'))
        expect(result).toHaveLength(28)
        expect(result.filter((d) => d.isCurrentMonth)).toHaveLength(28)
        expect(result.filter((d) => !d.isCurrentMonth)).toHaveLength(0)
        expect(result[0].dayOfMonth).toBe(1)
        expect(result[0].date.isSame(dayjs('2026-02-01'), 'day')).toBe(true)
        expect(result[27].dayOfMonth).toBe(28)
        expect(result[27].date.isSame(dayjs('2026-02-28'), 'day')).toBe(true)
    })

    test('should return 35 days for June 2026 (starts on Monday)', () => {
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

    test('should return 42 days for August 2026 (starts on Saturday)', () => {
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

    test('should return 35 days for February 2024 (leap year, starts on Thursday)', () => {
        const result = buildMonthDays(dayjs('2024-02-01'))
        expect(result).toHaveLength(35)
        expect(result.filter((d) => d.isCurrentMonth)).toHaveLength(29)
        expect(result.filter((d) => !d.isCurrentMonth)).toHaveLength(6)
        expect(result[0].dayOfMonth).toBe(28)
        expect(result[0].isCurrentMonth).toBe(false)
        expect(result[0].date.isSame(dayjs('2024-01-28'), 'day')).toBe(true)
        expect(result[4].dayOfMonth).toBe(1)
        expect(result[4].isCurrentMonth).toBe(true)
        expect(result[4].date.isSame(dayjs('2024-02-01'), 'day')).toBe(true)
        expect(result[32].dayOfMonth).toBe(29)
        expect(result[32].isCurrentMonth).toBe(true)
        expect(result[32].date.isSame(dayjs('2024-02-29'), 'day')).toBe(true)
        expect(result[34].dayOfMonth).toBe(2)
        expect(result[34].isCurrentMonth).toBe(false)
        expect(result[34].date.isSame(dayjs('2024-03-02'), 'day')).toBe(true)
    })
})
