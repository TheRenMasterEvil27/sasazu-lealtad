import { useEffect } from 'react'

// Modal de Bootstrap controlado por React (mismas clases: modal, modal-dialog, modal-content...)
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    document.body.classList.add('modal-open')
    const alTeclear = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', alTeclear)
    }
  }, [onClose])

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content rounded-4">
            <div className="modal-header border-0 pb-0">
              <h3 className="modal-title h5 fw-semibold">{title}</h3>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  )
}
