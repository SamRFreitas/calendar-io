import { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { addEvent, updateEvent, deleteEvent } from '@/store/eventsSlice'
import { type Event } from '@/types/event'
import { useAppSelector } from '@/store/hooks'
import { selectEvents } from '@/store/eventsSlice'

interface EventFormProps {
    event?: Event | null
    onClose: () => void
}

export default function EventForm({ event, onClose }: EventFormProps) {
    const dispatch = useDispatch()
    const isEditing = !!event
    const existingEvents = useAppSelector(selectEvents)

    const now = dayjs()
    const minDate = now.format('YYYY-MM-DDTHH:mm')

    const [name, setName] = useState(event?.name || '')
    const [type, setType] = useState<Event['type']>(event?.type || 'meeting')
    const [startDate, setStartDate] = useState(
        event?.startDate.slice(0, 16) || minDate
    )
    const [endDate, setEndDate] = useState(
        event?.endDate.slice(0, 16) || minDate
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

        if (isEditing && event) {
            const updatedEvent: Event = {
                ...event,
                name,
                type,
                startDate,
                endDate,
            }
            dispatch(updateEvent(updatedEvent))
            toast.success('Event updated successfully! 🎉')
        } else {
            const newEvent: Event = {
                id: crypto.randomUUID(),
                name,
                type,
                startDate,
                endDate,
            }
            dispatch(addEvent(newEvent))
            toast.success('Event added successfully! 🎉')
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
                    <option value="slot">Slot</option>
                    <option value="task">Task</option>
                </select>
            </div>

            <div className="form-field">
                <label className="form-label">Start</label>
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                    min={minDate}
                    data-testid="event-start"
                />
            </div>

            <div className="form-field">
                <label className="form-label">End</label>
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                    min={startDate || minDate}
                    data-testid="event-end"
                />
            </div>

            <div className="flex justify-between items-center mt-6">
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer"
                        data-testid="event-delete"
                    >
                        Delete
                    </button>
                )}
                <div className="flex gap-2 ml-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="form-button-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="form-button-submit"
                        data-testid="event-save"
                    >
                        {isEditing ? 'Save' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}