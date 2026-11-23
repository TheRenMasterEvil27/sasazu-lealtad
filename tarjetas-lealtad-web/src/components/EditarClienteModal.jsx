import { useState } from 'react'
import Modal from './Modal'
import { useClientes } from '../context/ClientesContext'

export default function EditarClienteModal({ cliente, onActualizado, onClose }) {
  const [nombre, setNombre] = useState(cliente.nombre)
  const [telefono, setTelefono] = useState(cliente.telefono)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const { editarCliente } = useClientes()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !telefono.trim()) {
      setError('El nombre y el teléfono son obligatorios')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      const actualizado = await editarCliente(cliente.id, { nombre, telefono })
      onActualizado(actualizado)
      onClose()
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <Modal title="Editar cliente" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-editar" className="form-label small text-secondary">Nombre completo</label>
          <input id="nombre-editar" className="form-control form-control-lg" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono-editar" className="form-label small text-secondary">Teléfono</label>
          <input id="telefono-editar" type="tel" className="form-control form-control-lg" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <div className="form-text">Para corregir un monto, toca el lápiz junto al consumo en el historial.</div>
        </div>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </Modal>
  )
}
