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
        <div className="flex items-center justify-between w-full">
            <button onClick={onPrev} className="nav-button">
                ←
            </button>
            <div className="flex items-center gap-3">
                <span className="nav-title">{title}</span>
            </div>
            <button onClick={onNext} className="nav-button">
                →
            </button>
        </div>
    )
}
