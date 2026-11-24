import { Router } from 'express'
import { pool } from '../db.js'
import { requerirSesion } from '../auth.js'
import { minutosBloqueado, registrarFallo, limpiar } from '../limitador.js'
import { HASH_FALSO, hashToken, nuevoToken, normalizarUsuario, verificarContrasena } from '../seguridad.js'

const router = Router()
const DIAS_SESION = Number(process.env.SESION_DIAS) || 7

// POST /api/auth/login  { usuario, contrasena }  -> { token, usuario }
router.post('/login', async (req, res) => {
  const nombreUsuario = normalizarUsuario(req.body?.usuario)
  const contrasena = typeof req.body?.contrasena === 'string' ? req.body.contrasena : ''
  if (!nombreUsuario || nombreUsuario.length > 50 || !contrasena || contrasena.length > 200) {
    return res.status(400).json({ error: 'Escribe tu usuario y tu contraseña' })
  }

  const espera = minutosBloqueado(req.ip, nombreUsuario)
  if (espera) {
    return res.status(429).json({ error: `Demasiados intentos. Prueba de nuevo en ${espera} min` })
  }

  const [filas] = await pool.query(
    'SELECT id, nombre, usuario, password_hash FROM usuarios WHERE usuario = ? AND activo = 1',
    [nombreUsuario]
  )
  const usuario = filas[0]
  const correcta = await verificarContrasena(contrasena, usuario?.password_hash ?? HASH_FALSO)
  if (!usuario || !correcta) {
    registrarFallo(req.ip, nombreUsuario)
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }

  limpiar(req.ip, nombreUsuario)
  const token = nuevoToken()
  await pool.query('DELETE FROM sesiones WHERE expira < NOW()')
  await pool.query(
    'INSERT INTO sesiones (token_hash, usuario_id, expira) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))',
    [hashToken(token), usuario.id, DIAS_SESION]
  )
  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, usuario: usuario.usuario } })
})

// GET /api/auth/yo  -> quién soy (sirve para saber si la sesión guardada sigue viva)
router.get('/yo', requerirSesion, (req, res) => {
  res.json({ usuario: req.usuario })
})

// POST /api/auth/logout  -> cierra solo esta sesión
router.post('/logout', requerirSesion, async (req, res) => {
  await pool.query('DELETE FROM sesiones WHERE token_hash = ?', [req.tokenHash])
  res.json({ ok: true })
})

export default router
