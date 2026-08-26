import dayjs from 'dayjs'
import { type ScheduleType } from '@/types/schedule'
import { getStartOfWeek } from '@/utils'

interface NavigationBarProps {
    currentDate: dayjs.Dayjs
    view: ScheduleType
    onPrev: () => void
    onNext: () => void
}

function formatTitle(currentDate: dayjs.Dayjs, view: ScheduleType): string {
    if (view === 'month') {
        return currentDate.format('MMMM YYYY')
    }

    const start = getStartOfWeek(currentDate)
    const end = start.add(6, 'day')
    return `${start.format('DD MMM')} - ${end.format('DD MMM, YYYY')}`
}

export default function NavigationBar({
    currentDate,
    view,
    onPrev,
    onNext,
}: NavigationBarProps) {
    const title = formatTitle(currentDate, view)

    return (
        <div className="flex items-center justify-center gap-1.5 md:gap-4 flex-1">
            <button onClick={onPrev} className="nav-button" aria-label="Previous">
                ←
            </button>
            <span className="nav-title">{title}</span>
            <button onClick={onNext} className="nav-button" aria-label="Next">
                →
            </button>
        </div>
    )
}
