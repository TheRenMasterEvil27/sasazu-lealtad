// Crea un usuario del personal, o le cambia la contraseña si ese usuario ya existe.
// Uso:  npm run usuario -- ana "Ana Torres"
//       (usuario sin espacios; el nombre para mostrar es opcional)
import { pool } from '../src/db.js'
import { hashearContrasena, normalizarUsuario } from '../src/seguridad.js'

const [usuarioCrudo, nombreCrudo] = process.argv.slice(2)
const usuario = normalizarUsuario(usuarioCrudo)
const nombre = (nombreCrudo ?? '').trim()

if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) {
  console.error('Uso: npm run usuario -- ana "Ana Torres"')
  console.error('El usuario debe tener de 3 a 30 caracteres: letras, números, punto, guion o guion bajo (sin espacios).')
  process.exit(1)
}

// Pide la contraseña sin mostrarla en pantalla ni dejarla en el historial de la terminal
function pedirContrasena(pregunta) {
  return new Promise((resolve) => {
    process.stdout.write(pregunta)
    if (!process.stdin.isTTY) {
      process.stdin.once('data', (d) => resolve(String(d).trim()))
      return
    }
    let texto = ''
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    const alTeclear = (c) => {
      for (const ch of c) {
        if (ch === '\r' || ch === '\n') {
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdin.removeListener('data', alTeclear)
          process.stdout.write('\n')
          return resolve(texto)
        }
        if (ch === '\u0003') process.exit(1) // Ctrl+C
        if (ch === '\u007f' || ch === '\b') texto = texto.slice(0, -1)
        else texto += ch
      }
    }
    process.stdin.on('data', alTeclear)
  })
}

const contrasena = await pedirContrasena('Contraseña (mínimo 8 caracteres): ')
const repetida = await pedirContrasena('Repite la contraseña: ')

if (contrasena.length < 8) {
  console.error('La contraseña debe tener al menos 8 caracteres.')
  process.exit(1)
}
if (contrasena !== repetida) {
  console.error('Las contraseñas no coinciden.')
  process.exit(1)
}

const hash = await hashearContrasena(contrasena)
const [existente] = await pool.query('SELECT id, nombre FROM usuarios WHERE usuario = ?', [usuario])

if (existente.length) {
  const nombreFinal = nombre || existente[0].nombre
  await pool.query('UPDATE usuarios SET nombre = ?, password_hash = ?, activo = 1 WHERE id = ?', [nombreFinal, hash, existente[0].id])
  await pool.query('DELETE FROM sesiones WHERE usuario_id = ?', [existente[0].id]) // cierra sus sesiones abiertas
  console.log(`Contraseña actualizada para ${usuario}. Sus sesiones abiertas se cerraron.`)
} else {
  await pool.query('INSERT INTO usuarios (usuario, nombre, password_hash) VALUES (?, ?, ?)', [usuario, nombre || usuario, hash])
  console.log(`Usuario creado: ${usuario}.`)
}
await pool.end()
