// Freno a los intentos fallidos de login (en memoria; se reinicia si se reinicia la API)
const VENTANA_MS = 15 * 60 * 1000
const MAX_POR_CUENTA = 5   // fallos por IP + teléfono
const MAX_POR_IP = 30      // fallos por IP

const intentos = new Map() // clave -> { n, desde }

function leer(clave) {
  const e = intentos.get(clave)
  if (e && Date.now() - e.desde > VENTANA_MS) {
    intentos.delete(clave)
    return null
  }
  return e ?? null
}

// Devuelve los minutos que faltan si está bloqueado, o 0 si puede intentar
export function minutosBloqueado(ip, cuenta) {
  const porCuenta = leer(`c:${ip}:${cuenta}`)
  const porIp = leer(`i:${ip}`)
  const bloqueos = [
    porCuenta?.n >= MAX_POR_CUENTA ? porCuenta : null,
    porIp?.n >= MAX_POR_IP ? porIp : null,
  ].filter(Boolean)
  if (bloqueos.length === 0) return 0
  const fin = Math.max(...bloqueos.map((e) => e.desde + VENTANA_MS))
  return Math.max(1, Math.ceil((fin - Date.now()) / 60000))
}

export function registrarFallo(ip, cuenta) {
  if (intentos.size > 5000) for (const k of intentos.keys()) leer(k) // limpia vencidos
  for (const clave of [`c:${ip}:${cuenta}`, `i:${ip}`]) {
    const e = leer(clave)
    if (e) e.n += 1
    else intentos.set(clave, { n: 1, desde: Date.now() })
  }
}

export function limpiar(ip, cuenta) {
  intentos.delete(`c:${ip}:${cuenta}`)
}
