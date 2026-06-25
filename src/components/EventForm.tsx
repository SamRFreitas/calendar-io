import { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addEvent, updateEvent, deleteEvent } from '@/store/eventsSlice'
import { type Event } from '@/types/event'

interface EventFormProps {
    event?: Event | null // se tiver, é edição; se não, é criação
    onClose: () => void
}

export default function EventForm({ event, onClose }: EventFormProps) {
    const dispatch = useDispatch()
    const isEditing = !!event

    const [name, setName] = useState(event?.name || '')
    const [type, setType] = useState<Event['type']>(event?.type || 'meeting')
    const [startDate, setStartDate] = useState(
        event?.startDate.slice(0, 16) || '',
    )
    const [endDate, setEndDate] = useState(event?.endDate.slice(0, 16) || '')

    const handleSave = () => {
        if (!name || !startDate || !endDate) {
            toast.error('Please fill in all fields')
            return
        }

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
                />
            </div>

            <div className="form-field">
                <label className="form-label">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Event['type'])}
                    className="form-select"
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
                />
            </div>

            <div className="form-field">
                <label className="form-label">End</label>
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="flex justify-between items-center mt-6">
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer"
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
                    >
                        {isEditing ? 'Save' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}
