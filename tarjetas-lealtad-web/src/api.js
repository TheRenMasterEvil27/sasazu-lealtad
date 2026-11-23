const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

async function pedir(ruta, opciones = {}) {
  let res
  try {
    res = await fetch(`${BASE}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que la API esté corriendo.')
  }
  const datos = await res.json().catch(() => null)
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
