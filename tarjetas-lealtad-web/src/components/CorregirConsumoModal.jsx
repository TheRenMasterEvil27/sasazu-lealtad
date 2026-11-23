import { useState } from 'react'
import Modal from './Modal'
import { useClientes } from '../context/ClientesContext'

export default function CorregirConsumoModal({ cliente, consumo, onActualizado, onClose }) {
  const [monto, setMonto] = useState(consumo.monto)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const { corregirConsumo, eliminarConsumo } = useClientes()

  async function ejecutar(accion) {
    setGuardando(true)
    setError(null)
    try {
      const actualizado = await accion()
      onActualizado(actualizado)
      onClose()
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  function handleGuardar(e) {
    e.preventDefault()
    const valor = Number(monto)
    if (!(valor > 0)) {
      setError('Escribe un monto mayor a 0')
      return
    }
    ejecutar(() => corregirConsumo(cliente.id, consumo.id, valor))
  }

  function handleEliminar() {
    if (window.confirm('¿Eliminar este consumo? El total y los sellos se recalcularán.')) {
      ejecutar(() => eliminarConsumo(cliente.id, consumo.id))
    }
  }

  return (
    <Modal title="Corregir consumo" onClose={onClose}>
      <form onSubmit={handleGuardar}>
        <p className="small text-secondary">Consumo del {consumo.fecha}</p>
        <div className="mb-3">
          <label htmlFor="monto-corregido" className="form-label small text-secondary">Monto correcto</label>
          <input
            id="monto-corregido"
            type="number"
            className="form-control form-control-lg"
            autoFocus
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cambio'}
        </button>
        <button type="button" className="btn btn-link text-danger w-100 mt-2 text-decoration-none fw-semibold" onClick={handleEliminar} disabled={guardando}>
          Eliminar consumo
        </button>
      </form>
    </Modal>
  )
}
