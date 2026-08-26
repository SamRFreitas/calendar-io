import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const [visible, setVisible] = useState(false)
    const [wasOpen, setWasOpen] = useState(isOpen)

    if (isOpen !== wasOpen) {
        setWasOpen(isOpen)
        if (isOpen) setVisible(false)
    }

    useEffect(() => {
        if (!isOpen) return
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [isOpen])

    if (!isOpen) return null

    return createPortal(
        <div className={`modal-overlay ${visible ? 'modal-overlay-visible' : ''}`}>
            <div className={`modal-content ${visible ? 'modal-content-visible' : ''}`}>
                <button onClick={onClose} className="modal-close-button" aria-label="Close">
                    ×
                </button>
                <div className="mt-3">{children}</div>
            </div>
        </div>,
        document.getElementById('modal')!,
    )
}
