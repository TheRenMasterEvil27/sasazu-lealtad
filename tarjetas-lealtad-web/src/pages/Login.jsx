import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // Por ahora no valida nada de verdad — eso llega con el backend
    navigate('/clientes')
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

      <form className="flex-grow-1 p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label small text-secondary">Teléfono</label>
          <input
            id="telefono"
            type="tel"
            className="form-control form-control-lg"
            placeholder="55 1234 5678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contrasena" className="form-label small text-secondary">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            className="form-control form-control-lg"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100 shadow-sm">
          Iniciar sesión
        </button>
        <button type="button" className="btn btn-link w-100 mt-3 text-decoration-none">
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </div>
  )
}
