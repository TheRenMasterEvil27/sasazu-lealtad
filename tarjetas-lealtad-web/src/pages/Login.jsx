import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [usuarioEscrito, setUsuarioEscrito] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState(null)
  const [entrando, setEntrando] = useState(false)
  const { usuario, verificando, iniciarSesion } = useAuth()
  const navigate = useNavigate()

  // Si ya hay sesión guardada, no tiene caso mostrar el login
  if (usuario) return <Navigate to="/clientes" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    if (!usuarioEscrito.trim() || !contrasena) {
      setError('Escribe tu usuario y tu contraseña')
      return
    }
    setEntrando(true)
    setError(null)
    try {
      await iniciarSesion(usuarioEscrito, contrasena)
      navigate('/clientes', { replace: true })
    } catch (err) {
      setError(err.message)
      setEntrando(false)
    }
  }

  return (
    <div className="app-shell mx-auto d-flex flex-column">
      <div className="login-hero text-white text-center px-3 pt-5 pb-4">
        <div
          className="bg-body text-primary rounded-4 d-inline-flex align-items-center justify-content-center fw-bold fs-2 mt-4 mb-3 font-display"
          style={{ width: 64, height: 64 }}
        >
          S
        </div>
        <h1 className="h4 fw-semibold mb-0">Sasazu</h1>
        <small className="opacity-75">BURGER &amp; BEER</small>
      </div>

      {verificando ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status" aria-label="Cargando" />
        </div>
      ) : (
        <form className="flex-grow-1 p-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label small text-secondary">Usuario</label>
            <input
              id="usuario"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="form-control form-control-lg"
              placeholder="tu usuario"
              value={usuarioEscrito}
              onChange={(e) => setUsuarioEscrito(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contrasena" className="form-label small text-secondary">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100 shadow-sm" disabled={entrando}>
            {entrando ? 'Entrando…' : 'Iniciar sesión'}
          </button>
          <p className="text-center small text-secondary mt-4 mb-0">
            ¿Olvidaste tu contraseña? Pide al administrador que la restablezca.
          </p>
        </form>
      )}
    </div>
  )
}
