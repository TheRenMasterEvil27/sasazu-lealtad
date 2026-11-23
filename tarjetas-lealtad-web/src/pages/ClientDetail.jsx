import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import AppHeader from '../components/AppHeader'
import RegistrarConsumoModal from '../components/RegistrarConsumoModal'
import EditarClienteModal from '../components/EditarClienteModal'
import CorregirConsumoModal from '../components/CorregirConsumoModal'

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [error, setError] = useState(null)
  // null | { tipo: 'consumo' } | { tipo: 'editar' } | { tipo: 'corregir', consumo }
  const [modal, setModal] = useState(null)

  useEffect(() => {
    let activo = true
    api
      .obtenerCliente(id)
      .then((c) => activo && setCliente(c))
      .catch((e) => activo && setError(e.message))
    return () => {
      activo = false
    }
  }, [id])

  if (!cliente) {
    return (
      <div className="app-shell mx-auto d-flex flex-column">
        <AppHeader title={error ? 'No se pudo cargar el cliente' : 'Cargando…'} onBack={() => navigate(-1)} />
        {error && <div className="alert alert-danger m-3 text-center">{error}</div>}
      </div>
    )
  }

  const cierre = () => setModal(null)

  return (
    <div className="app-shell mx-auto d-flex flex-column">
      <AppHeader
        title={cliente.nombre}
        subtitle={`Cliente desde ${cliente.clienteDesde}`}
        onBack={() => navigate(-1)}
        action={
          <button
            type="button"
            className="btn btn-sm btn-light bg-opacity-25 text-white border-0 rounded-circle"
            onClick={() => setModal({ tipo: 'editar' })}
            aria-label="Editar cliente"
          >
            ✎
          </button>
        }
      />

      <div className="p-3">
        <div className="card text-bg-primary rounded-4 border-0">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="h6 fw-semibold mb-0">Tarjeta de lealtad</div>
                <small className="opacity-75">
                  {cliente.sellosAcumulados} de {cliente.sellosMeta} sellos
                </small>
              </div>
              <div className="text-end">
                <div className="h5 fw-bold mb-0">${cliente.totalGastado}</div>
                <small className="opacity-75">gastado total</small>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {Array.from({ length: cliente.sellosMeta }, (_, i) => {
                const numero = i + 1
                const lleno = numero <= cliente.sellosAcumulados
                return (
                  <div
                    key={numero}
                    className={`rounded-circle d-flex align-items-center justify-content-center small border ${
                      lleno ? 'bg-warning border-warning text-dark' : 'border-white border-opacity-50'
                    }`}
                    style={{ width: 32, height: 32 }}
                  >
                    {lleno ? '✓' : numero}
                  </div>
                )
              })}
            </div>

            <small className="d-block mt-3 opacity-75">
              {cliente.tarjetaCompleta
                ? 'Tarjeta completa: premio listo para canjear'
                : `${cliente.sellosMeta - cliente.sellosAcumulados} sellos más para su hamburguesa gratis`}
            </small>
          </div>
        </div>
      </div>

      <h3 className="h6 fw-semibold text-secondary px-3 mt-2 mb-2">Historial de consumo</h3>
      {cliente.historial.length === 0 ? (
        <p className="px-3 small text-secondary">Aún no tiene consumos registrados.</p>
      ) : (
        <ul className="list-group list-group-flush">
          {cliente.historial.map((mov) => (
            <li key={mov.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-3">
              <div>
                <div>Consumo en local</div>
                <small className="text-secondary">{mov.fecha}</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold">${mov.monto}</span>
                <button
                  type="button"
                  className="btn btn-sm rounded-circle bg-success-subtle text-success-emphasis"
                  onClick={() => setModal({ tipo: 'corregir', consumo: mov })}
                  aria-label="Corregir consumo"
                >
                  ✎
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="p-3 mt-2">
        <button type="button" className="btn btn-primary btn-lg rounded-pill w-100 shadow-sm" onClick={() => setModal({ tipo: 'consumo' })}>
          Registrar consumo
        </button>
      </div>

      {modal?.tipo === 'consumo' && (
        <RegistrarConsumoModal cliente={cliente} onActualizado={setCliente} onClose={cierre} />
      )}
      {modal?.tipo === 'editar' && (
        <EditarClienteModal cliente={cliente} onActualizado={setCliente} onClose={cierre} />
      )}
      {modal?.tipo === 'corregir' && (
        <CorregirConsumoModal
          cliente={cliente}
          consumo={modal.consumo}
          onActualizado={setCliente}
          onClose={cierre}
        />
      )}
    </div>
  )
}
