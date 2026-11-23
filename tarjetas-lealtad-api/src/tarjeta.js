import 'dotenv/config'

const META_PREMIO = Number(process.env.META_PREMIO) || 500
const SELLOS_META = Number(process.env.SELLOS_META) || 10

function iniciales(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

// Cada META_PREMIO gastados = 1 sello; la barra muestra lo que lleva del sello actual.
export function armarCliente(fila) {
  const total = Number(fila.total_gastado)
  const sellosGanados = Math.floor(total / META_PREMIO)

  return {
    id: fila.id,
    iniciales: iniciales(fila.nombre),
    nombre: fila.nombre,
    telefono: fila.telefono,
    fechaRegistro: fila.fecha_registro,
    totalGastado: total,
    metaParaPremio: META_PREMIO,
    gastado: Math.round((total % META_PREMIO) * 100) / 100,
    sellosMeta: SELLOS_META,
    sellosAcumulados: Math.min(sellosGanados, SELLOS_META),
    tarjetaCompleta: sellosGanados >= SELLOS_META,
  }
}
