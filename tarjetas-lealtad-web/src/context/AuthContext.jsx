import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, leerToken } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // Si hay un token guardado, hay que preguntarle al servidor si todavía vale antes de decidir
  const [verificando, setVerificando] = useState(() => Boolean(leerToken()))

  useEffect(() => {
    api.alExpirarSesion(() => setUsuario(null))
    if (!leerToken()) return
    let activo = true
    api
      .usuarioActual()
      .then((u) => activo && setUsuario(u))
      .catch(() => {}) // 401 ya limpió el token; sin red, se pedirá iniciar sesión
      .finally(() => activo && setVerificando(false))
    return () => {
      activo = false
    }
  }, [])

  const iniciarSesion = useCallback(async (usuario, contrasena) => {
    setUsuario(await api.iniciarSesion(usuario, contrasena))
  }, [])

  const cerrarSesion = useCallback(async () => {
    await api.cerrarSesion()
    setUsuario(null)
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, verificando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
