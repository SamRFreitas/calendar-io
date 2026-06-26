import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import { useState } from 'react'
import { type ScheduleType } from '@/types/schedule'
import Menu from './Menu'
import ViewToggle from './ViewToggle'
import NavigationBar from './NavigationBar'
import MonthView from './MonthView'
import WeekView from './WeekView'
import Modal from '@/components/Modal'
import EventForm from '@/components/EventForm'
import { type Event } from '@/types/event'
import { useLoadEvents } from '@/store/useLoadEvents'

dayjs.extend(localeData)

export default function Schedule() {
    const [currentDate, setCurrentDate] = useState(dayjs())
    const [viewType, setViewType] = useState<ScheduleType>('month')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const { loading, error } = useLoadEvents()

    const handleEventClick = (event: Event) => {
        setEditingEvent(event)
    }

    const week = dayjs.localeData().weekdays()

    const goPrev = () => {
        const unit = viewType === 'week' ? 'week' : 'month'
        setCurrentDate((prev) => prev.subtract(1, unit))
    }

    const goNext = () => {
        const unit = viewType === 'week' ? 'week' : 'month'
        setCurrentDate((prev) => prev.add(1, unit))
    }

    const goToday = () => {
        setCurrentDate(dayjs())
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <p className="loading-text">Loading events...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-screen">
                <p className="error-text">Error loading events: {error}</p>
            </div>
        )
    }

    return (
        <div className="schedule-container">
            <Menu>
                <ViewToggle view={viewType} onChange={setViewType} />
                <NavigationBar
                    currentDate={currentDate}
                    view={viewType}
                    onPrev={goPrev}
                    onNext={goNext}
                />
                <div className="flex justify-end w-full">
                    <button
                        onClick={goToday}
                        className="add-event-button mr-8"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="add-event-button"
                        data-testid="add-event-button"
                    >
                        + Add Event
                    </button>
                </div>
            </Menu>

            <div className="week-header">
                {week.map((item, index) => (
                    <div key={index} className="w-full">
                        {item}
                    </div>
                ))}
            </div>

            {viewType === 'week' ? (
                <WeekView
                    currentDate={currentDate}
                    onEventClick={handleEventClick}
                />
            ) : (
                <MonthView
                    currentDate={currentDate}
                    onEventClick={handleEventClick}
                />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <EventForm onClose={() => setIsModalOpen(false)} />
            </Modal>

            <Modal
                isOpen={!!editingEvent}
                onClose={() => setEditingEvent(null)}
            >
                {editingEvent && (
                    <EventForm
                        event={editingEvent}
                        onClose={() => setEditingEvent(null)}
                    />
                )}
            </Modal>
        </div>
    )
}