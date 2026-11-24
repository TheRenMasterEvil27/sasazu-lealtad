import { randomBytes, scrypt, createHash, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

// Contraseñas: scrypt (viene con Node, no requiere instalar nada). Formato guardado: "sal:hash"
export async function hashearContrasena(contrasena) {
  const sal = randomBytes(16)
  const hash = await scryptAsync(contrasena, sal, 64)
  return `${sal.toString('hex')}:${hash.toString('hex')}`
}

export async function verificarContrasena(contrasena, guardado) {
  const [salHex, hashHex] = guardado.split(':')
  const esperado = Buffer.from(hashHex, 'hex')
  const calculado = await scryptAsync(contrasena, Buffer.from(salHex, 'hex'), esperado.length)
  return timingSafeEqual(calculado, esperado)
}

// Se compara contra este hash cuando el teléfono no existe, para que tardar lo mismo
// no delate qué teléfonos están registrados.
export const HASH_FALSO = await hashearContrasena('relleno-que-nadie-puede-usar')

// Tokens de sesión: aleatorios; en la base solo se guarda su SHA-256
export const nuevoToken = () => randomBytes(32).toString('hex')
export const hashToken = (token) => createHash('sha256').update(token).digest('hex')

// El usuario no distingue mayúsculas: " Ana " -> "ana"
export const normalizarUsuario = (u) => String(u ?? '').trim().toLowerCase()
