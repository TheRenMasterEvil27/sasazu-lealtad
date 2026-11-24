import { pool } from './db.js'
import { hashToken } from './seguridad.js'

// Middleware: deja pasar solo a quien trae una sesión válida (Authorization: Bearer <token>)
export async function requerirSesion(req, res, next) {
  const m = /^Bearer (\S+)$/.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'Inicia sesión para continuar' })

  const tokenHash = hashToken(m[1])
  const [filas] = await pool.query(
    `SELECT u.id, u.nombre, u.usuario
       FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.token_hash = ? AND s.expira > NOW() AND u.activo = 1`,
    [tokenHash]
  )
  if (filas.length === 0) return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión de nuevo' })

  req.usuario = filas[0]
  req.tokenHash = tokenHash
  next()
}
