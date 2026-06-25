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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600">Loading events...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-red-600">
                    Error loading events: {error}
                </p>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto px-8 mt-8">

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
                        onClick={() => setIsModalOpen(true)}
                        className="add-event-button"
                    >
                        + Adicionar Evento
                    </button>
                </div>

            </Menu>
            

            <div className="grid grid-cols-7 text-center mt-8 bg-[#1a1a1a] text-white font-bold rounded-t-lg text-lg py-4">
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
