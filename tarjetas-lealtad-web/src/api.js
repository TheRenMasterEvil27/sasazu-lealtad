const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// --- Token de sesión (se guarda en el teléfono/navegador para no pedir login a cada rato) ---
const CLAVE_TOKEN = 'sasazu_token'
export const leerToken = () => {
  try { return localStorage.getItem(CLAVE_TOKEN) } catch { return null }
}
const guardarToken = (t) => {
  try { localStorage.setItem(CLAVE_TOKEN, t) } catch { /* sin almacenamiento: la sesión dura hasta cerrar la pestaña */ }
}
const borrarToken = () => {
  try { localStorage.removeItem(CLAVE_TOKEN) } catch { /* nada que borrar */ }
}

// AuthContext registra aquí qué hacer cuando el servidor dice que la sesión ya no vale
let alExpirarSesion = () => {}

async function pedir(ruta, opciones = {}) {
  const { sinSesion, ...resto } = opciones
  const token = leerToken()
  let res
  try {
    res = await fetch(`${BASE}${ruta}`, {
      ...resto,
      headers: {
        'Content-Type': 'application/json',
        ...(token && !sinSesion && { Authorization: `Bearer ${token}` }),
      },
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que la API esté corriendo.')
  }
  const datos = await res.json().catch(() => null)
  if (res.status === 401 && token && !sinSesion) {
    borrarToken()
    alExpirarSesion()
  }
  if (!res.ok) throw new Error(datos?.error ?? 'Ocurrió un error en el servidor')
  return datos
}

const formato = (iso, opciones) => new Date(iso).toLocaleDateString('es-MX', opciones)

function normalizar(c) {
  return {
    ...c,
    clienteDesde: formato(c.fechaRegistro, { month: 'short', year: 'numeric' }),
    historial: c.historial?.map((m) => ({
      ...m,
      fecha: formato(m.fecha, { day: '2-digit', month: 'short', year: 'numeric' }),
    })),
  }
}

const cuerpo = (obj) => JSON.stringify(obj)

export const api = {
  alExpirarSesion: (fn) => {
    alExpirarSesion = fn
  },
  iniciarSesion: async (usuario, contrasena) => {
    const { token, usuario: datos } = await pedir('/auth/login', {
      method: 'POST',
      body: cuerpo({ usuario, contrasena }),
      sinSesion: true,
    })
    guardarToken(token)
    return datos
  },
  usuarioActual: () => pedir('/auth/yo').then((d) => d.usuario),
  cerrarSesion: async () => {
    try {
      await pedir('/auth/logout', { method: 'POST', body: cuerpo({}) })
    } catch {
      /* si falla (sin red o sesión ya vencida) igual se cierra en este dispositivo */
    }
    borrarToken()
  },
  listarClientes: () => pedir('/clientes').then((lista) => lista.map(normalizar)),
  obtenerCliente: (id) => pedir(`/clientes/${id}`).then(normalizar),
  crearCliente: (datos) => pedir('/clientes', { method: 'POST', body: cuerpo(datos) }).then(normalizar),
  editarCliente: (id, datos) =>
    pedir(`/clientes/${id}`, { method: 'PUT', body: cuerpo(datos) }).then(normalizar),
  registrarConsumo: (id, monto) =>
    pedir(`/clientes/${id}/consumos`, { method: 'POST', body: cuerpo({ monto }) }).then(normalizar),
  corregirConsumo: (id, consumoId, monto) =>
    pedir(`/clientes/${id}/consumos/${consumoId}`, { method: 'PUT', body: cuerpo({ monto }) }).then(normalizar),
  eliminarConsumo: (id, consumoId) =>
    pedir(`/clientes/${id}/consumos/${consumoId}`, { method: 'DELETE' }).then(normalizar),
}
