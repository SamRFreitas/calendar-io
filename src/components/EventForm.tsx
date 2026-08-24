import { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice'
import { type Event } from '../types/event'
import { useAppSelector } from '../store/hooks'
import { selectEvents } from '../store/eventsSlice'

interface EventFormProps {
    event?: Event | null
    onClose: () => void
    startDate?: string
    endDate?: string
}

export default function EventForm({ event, onClose, startDate: propStartDate, endDate: propEndDate }: EventFormProps) {
    const dispatch = useDispatch()
    const isEditing = !!event
    const existingEvents = useAppSelector(selectEvents)

    const now = dayjs()
    const minDate = now.format('YYYY-MM-DDTHH:mm')

    const [name, setName] = useState(event?.name || '')
    const [type, setType] = useState<Event['type']>(event?.type || 'meeting')
    const [allDay, setAllDay] = useState(
        event?.allDay || false
    )
    const [startDate, setStartDate] = useState(
        event?.startDate?.slice(0, 16) || propStartDate || minDate
    )
    const [endDate, setEndDate] = useState(
        event?.endDate?.slice(0, 16) || propEndDate || minDate
    )

    const validateEvent = (): boolean => {
        if (!name || !startDate || !endDate) {
            toast.error('Please fill in all fields')
            return false
        }

        const start = dayjs(startDate)
        const end = dayjs(endDate)

        if (start.isBefore(now)) {
            toast.error('Cannot create an event in the past')
            return false
        }

        if (!end.isAfter(start)) {
            toast.error('End date must be after start date')
            return false
        }

        const hasConflict = existingEvents.some((e: Event) => {
            if (isEditing && e.id === event?.id) return false
            const eStart = dayjs(e.startDate)
            const eEnd = dayjs(e.endDate)
            return start.isBefore(eEnd) && end.isAfter(eStart)
        })

        if (hasConflict) {
            toast.error('This time slot conflicts with an existing event')
            return false
        }

        return true
    }

    const handleSave = () => {
        if (!validateEvent()) return

        // Format dates: if allDay, ensure YYYY-MM-DD format for ISO storage
        const formattedStartDate = allDay
            ? dayjs(startDate).startOf('day').format('YYYY-MM-DDTHH:mm')
            : startDate
        const formattedEndDate = allDay
            ? dayjs(endDate).endOf('day').format('YYYY-MM-DDTHH:mm')
            : endDate

        if (isEditing && event) {
            const updatedEvent: Event = {
                ...event,
                name,
                type,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }
            dispatch(updateEvent(updatedEvent))
            toast.success('Event updated successfully!')
        } else {
            const newEvent: Event = {
                id: crypto.randomUUID(),
                name,
                type,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }
            dispatch(addEvent(newEvent))
            toast.success('Event added successfully!')
        }

        onClose()
    }

    const handleDelete = () => {
        if (!isEditing || !event) return
        if (window.confirm('Are you sure you want to delete this event?')) {
            dispatch(deleteEvent(event.id))
            toast.success('Event deleted!')
            onClose()
        }
    }

    return (
        <div className="form-container">
            <h2 className="form-title">
                {isEditing ? 'Edit Event' : 'Add Event'}
            </h2>

            <div className="form-field">
                <label className="form-label">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    data-testid="event-name"
                />
            </div>

            <div className="form-field">
                <label className="form-label">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Event['type'])}
                    className="form-select"
                    data-testid="event-type"
                >
                    <option value="meeting">Meeting</option>
                    <option value="task">Task</option>
                </select>
            </div>

            <div className="form-field">
                <label className="form-label">
                    <input
                        type="checkbox"
                        checked={allDay}
                        onChange={() => setAllDay(!allDay)}
                        className="form-checkbox"
                    />
                    All day
                </label>
            </div>

            <div className="form-field">
                <label className="form-label">Start</label>
                <input
                    type={allDay ? 'date' : 'datetime-local'}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                    min={allDay ? now.format('YYYY-MM-DD') : minDate}
                    data-testid="event-start"
                />
                {allDay && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Select dates (not times)
                    </p>
                )}
            </div>

            <div className="form-field">
                <label className="form-label">End</label>
                <input
                    type={allDay ? 'date' : 'datetime-local'}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                    min={allDay ? startDate || now.format('YYYY-MM-DD') : startDate || minDate}
                    data-testid="event-end"
                />
                {allDay && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Select dates (not times)
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="form-button-delete"
                        data-testid="event-delete"
                    >
                        Delete
                    </button>
                )}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="form-button-cancel w-full"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="form-button-submit w-full"
                        data-testid="event-save"
                    >
                        {isEditing ? 'Save' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}