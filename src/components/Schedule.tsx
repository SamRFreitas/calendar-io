import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setViewType, setCurrentDate as uiSetCurrentDate, openModal, closeModal, setEditingEvent } from '@/store/uiSlice'
import { type RootState } from '@/store/index'
import Menu from './Menu'
import ViewToggle from './ViewToggle'
import ThemeToggle from './ThemeToggle'
import NavigationBar from './NavigationBar'
import MonthView from './MonthView'
import WeekView from './WeekView'
import Modal from '@/components/Modal'
import EventForm from '@/components/EventForm'
import { type Event } from '@/types/event'
import { useLoadEvents } from '@/store/useLoadEvents'

dayjs.extend(localeData)

export default function Schedule() {
    const dispatch = useAppDispatch()

    // UI state from Redux slice
    const { viewType, currentDate: currentDateStr, isModalOpen, editingEvent } = useAppSelector((state: RootState) => state.ui)
    const currentDate = dayjs(currentDateStr)

    // Derive week day names from currentDate locale
    const week = dayjs.localeData().weekdays()
    const weekShort = dayjs.localeData().weekdaysMin()

    const { loading, error, hasError } = useLoadEvents()

    const handleEventClick = (event: Event) => {
        dispatch(setEditingEvent(event))
    }

    const handleDayClick = (date: dayjs.Dayjs) => {
        dispatch(uiSetCurrentDate(date.toISOString()))
        dispatch(openModal())
    }

    const goPrev = () => {
        const unit = viewType === 'week' ? 'week' : 'month'
        dispatch(uiSetCurrentDate(currentDate.subtract(1, unit).toISOString()))
    }

    const goNext = () => {
        const unit = viewType === 'week' ? 'week' : 'month'
        dispatch(uiSetCurrentDate(currentDate.add(1, unit).toISOString()))
    }

    const goToday = () => {
        dispatch(uiSetCurrentDate(dayjs().toISOString()))
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <p className="loading-text">Loading events...</p>
            </div>
        )
    }

    if (hasError) {
        return (
            <div className="error-screen">
                <p className="error-text">Error loading events: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Retry
                </button>
            </div>
        )
    }

    if (!currentDate) {
        return (
            <div className="empty-state">
                <p>No events found</p>
            </div>
        )
    }

    return (
        <div className="schedule-container">
            <Menu>
                <div className="flex items-center gap-3 order-1">
                    <ViewToggle
                        view={viewType}
                        onChange={(view) => dispatch(setViewType(view))}
                    />
                    <ThemeToggle />
                </div>
                <div className="order-3 md:order-2 w-full md:w-auto md:flex-1">
                    <NavigationBar
                        currentDate={currentDate}
                        view={viewType}
                        onPrev={goPrev}
                        onNext={goNext}
                    />
                </div>
                <div className="flex gap-2 order-2 md:order-3">
                    <button
                        onClick={goToday}
                        className="add-event-button"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => dispatch(openModal())}
                        className="add-event-button"
                        data-testid="add-event-button"
                    >
                        + Add Event
                    </button>
                </div>
            </Menu>

            <div className="week-header">
                {week.map((item: string, index: number) => (
                    <div key={index} className="w-full">
                        <span className="hidden md:inline">{item}</span>
                        <span className="md:hidden">{weekShort[index]}</span>
                    </div>
                ))}
            </div>

            {viewType === 'week' ? (
                <WeekView
                    currentDate={currentDate}
                    onEventClick={handleEventClick}
                    onDayClick={handleDayClick}
                />
            ) : (
                <MonthView
                    currentDate={currentDate}
                    onEventClick={handleEventClick}
                    onDayClick={handleDayClick}
                />
            )}

            <Modal isOpen={isModalOpen} onClose={() => dispatch(closeModal())}>
                <EventForm onClose={() => dispatch(closeModal())} />
            </Modal>

            <Modal
                isOpen={!!editingEvent}
                onClose={() => dispatch(setEditingEvent(null))}
            >
                {editingEvent && (
                    <EventForm
                        event={editingEvent}
                        onClose={() => dispatch(setEditingEvent(null))}
                    />
                )}
            </Modal>
        </div>
    )
}