export interface Event {
    id: string
    type: 'meeting' | 'task'
    name: string
    startDate: string // ISO: "2026-06-22T09:00:00"
    endDate: string
    allDay?: boolean
}
