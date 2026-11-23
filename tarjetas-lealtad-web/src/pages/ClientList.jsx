import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientes } from '../context/ClientesContext'
import AppHeader from '../components/AppHeader'

export default function ClientList() {
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()
  const { clientes, cargando, error, recargar } = useClientes()

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda)
  )

  return (
    <div className="app-shell mx-auto d-flex flex-column">
      <AppHeader title="Clientes frecuentes" subtitle={`${clientes.length} registrados`} />

      <div className="px-3 pt-3">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por nombre o teléfono"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="flex-grow-1 d-flex flex-column gap-3 px-3 pt-3 pb-5 mb-5">
        {cargando && (
          <div className="text-center text-secondary py-4">
            <div className="spinner-border spinner-border-sm me-2" role="status" />
            Cargando clientes…
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            <p className="mb-2">{error}</p>
            <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={recargar}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && clientesFiltrados.length === 0 && (
          <p className="text-center text-secondary py-4">No hay clientes que coincidan.</p>
        )}

        {clientesFiltrados.map((cliente) => {
          const progreso = Math.min(cliente.gastado / cliente.metaParaPremio, 1) * 100
          return (
            <button
              key={cliente.id}
              type="button"
              className="card w-100 text-start rounded-4"
              onClick={() => navigate(`/clientes/${cliente.id}`)}
            >
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-success-subtle text-success-emphasis d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
                  style={{ width: 44, height: 44 }}
                >
                  {cliente.iniciales}
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="fw-semibold">{cliente.nombre}</div>
                  <div className="small text-secondary mb-2">{cliente.telefono}</div>
                  <div className="progress" style={{ height: 6 }} role="progressbar" aria-valuenow={progreso} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-bar bg-success" style={{ width: `${progreso}%` }} />
                  </div>
                  <small className="text-success-emphasis fw-medium">
                    ${cliente.gastado} de ${cliente.metaParaPremio} para su siguiente sello
                  </small>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="btn btn-warning rounded-circle position-fixed shadow d-flex align-items-center justify-content-center fs-2 fw-semibold p-0"
        style={{ width: 56, height: 56, right: 24, bottom: 26 }}
        onClick={() => navigate('/agregar')}
        aria-label="Agregar cliente"
      >
        +
      </button>
    </div>
  )
}
