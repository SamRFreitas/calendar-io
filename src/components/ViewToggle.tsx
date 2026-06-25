import { type ScheduleType } from '@/types/schedule'

interface ViewToggleProps {
    view: ScheduleType
    onChange: (view: ScheduleType) => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
    return (
        <div className="view-toggle-container">
            <div className="view-toggle-group">
                <button
                    className={`view-toggle-button ${
                        view === 'month' ? 'view-toggle-button-active' : ''
                    }`}
                    onClick={() => onChange('month')}
                >
                    Month
                </button>
                <button
                    className={`view-toggle-button ${
                        view === 'week' ? 'view-toggle-button-active' : ''
                    }`}
                    onClick={() => onChange('week')}
                >
                    Week
                </button>
            </div>
        </div>
    )
}
