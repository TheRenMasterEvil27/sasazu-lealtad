import { useState } from 'react'
import Modal from './Modal'
import { useClientes } from '../context/ClientesContext'

export default function RegistrarConsumoModal({ cliente, onActualizado, onClose }) {
  const [monto, setMonto] = useState('')
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const { registrarConsumo } = useClientes()

  async function handleSubmit(e) {
    e.preventDefault()
    const valor = Number(monto)
    if (!(valor > 0)) {
      setError('Escribe un monto mayor a 0')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      const actualizado = await registrarConsumo(cliente.id, valor)
      onActualizado(actualizado)
      onClose()
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <Modal title="Registrar consumo" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="monto" className="form-label small text-secondary">Monto del consumo</label>
          <input
            id="monto"
            type="number"
            className="form-control form-control-lg"
            placeholder="$0.00"
            autoFocus
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar consumo'}
        </button>
      </form>
    </Modal>
  )
}
