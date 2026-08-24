import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-button" aria-label="Close">
                    ×
                </button>
                <div className="mt-3">{children}</div>
            </div>
        </div>,
        document.getElementById('modal')!,
    )
}
