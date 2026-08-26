import { type Event } from '../types/event'

export const typeColorClass: Record<Event['type'], string> = {
    meeting: 'event-meeting',
    task: 'event-task',
}

export const typeBorderClass: Record<Event['type'], string> = {
    meeting: 'border-l-secondary',
    task: 'border-l-warning',
}

export const typeLabel: Record<Event['type'], string> = {
    meeting: 'Meeting',
    task: 'Task',
}

export const typeIcon: Record<Event['type'], (className: string) => React.ReactElement> = {
    meeting: (className) => (
        <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.9" />
            <circle cx="10" cy="9" r="3" fill="currentColor" opacity="0.6" />
        </svg>
    ),
    task: (className) => (
        <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
}
