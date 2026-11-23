import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext'
import AppHeader from '../components/AppHeader'

export default function AddClient() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [consumoInicial, setConsumoInicial] = useState('')
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const navigate = useNavigate()
  const { agregarCliente } = useClientes()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !telefono.trim()) {
      setError('El nombre y el teléfono son obligatorios')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      await agregarCliente({
        nombre,
        telefono,
        consumoInicial: Number(consumoInicial) || 0,
      })
      navigate('/clientes')
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="app-shell mx-auto d-flex flex-column">
      <AppHeader title="Nuevo cliente" subtitle="Se crea su tarjeta al guardar" onBack={() => navigate(-1)} />

      <form className="flex-grow-1 p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label small text-secondary">Nombre completo</label>
          <input
            id="nombre"
            className="form-control form-control-lg"
            placeholder="Ej. Ana Torres"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label small text-secondary">Teléfono</label>
          <input
            id="telefono"
            type="tel"
            className="form-control form-control-lg"
            placeholder="10 dígitos"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="consumo" className="form-label small text-secondary">Consumo inicial (opcional)</label>
          <input
            id="consumo"
            type="number"
            className="form-control form-control-lg"
            placeholder="$0.00"
            value={consumoInicial}
            onChange={(e) => setConsumoInicial(e.target.value)}
          />
          <div className="form-text">Si ya consumió hoy, agrégalo aquí para que sume a su primer sello.</div>
        </div>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100 shadow-sm" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cliente'}
        </button>
      </form>
    </div>
  )
}
