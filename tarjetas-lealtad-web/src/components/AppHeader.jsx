// Encabezado verde compartido por todas las pantallas
export default function AppHeader({ title, subtitle, onBack, action }) {
  return (
    <header className="bg-primary text-white d-flex align-items-center gap-3 px-3 pt-4 pb-3">
      {onBack && (
        <button type="button" className="btn btn-link text-white p-0 fs-4 lh-1" onClick={onBack} aria-label="Regresar">
          ←
        </button>
      )}
      <div>
        <h2 className="h5 fw-semibold mb-0">{title}</h2>
        {subtitle && <small className="opacity-75">{subtitle}</small>}
      </div>
      {action && <div className="ms-auto">{action}</div>}
    </header>
  )
}
