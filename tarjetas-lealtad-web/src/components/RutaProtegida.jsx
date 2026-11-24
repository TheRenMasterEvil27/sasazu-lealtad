import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ClientesProvider } from '../context/ClientesContext'

// Solo deja ver las pantallas internas si hay sesión. Los clientes se cargan hasta aquí,
// ya con sesión iniciada (y se descartan al cerrarla).
export default function RutaProtegida() {
  const { usuario, verificando } = useAuth()

  if (verificando) {
    return (
      <div className="app-shell mx-auto d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" aria-label="Cargando" />
      </div>
    )
  }
  if (!usuario) return <Navigate to="/" replace />

  return (
    <ClientesProvider>
      <Outlet />
    </ClientesProvider>
  )
}
