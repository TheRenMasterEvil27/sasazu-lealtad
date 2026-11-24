import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { requerirSesion } from './auth.js'
import auth from './routes/auth.js'
import clientes from './routes/clientes.js'

const app = express()

// Detrás de un proxy (hosting), TRUST_PROXY=1 para que req.ip sea la IP real del visitante
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY))

// CORS_ORIGIN (opcional): dominios permitidos separados por coma. Vacío = cualquiera (solo desarrollo)
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN.split(',') } : undefined))
app.use(express.json())

app.get('/api/salud', async (req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true, baseDeDatos: 'conectada' })
})

app.use('/api/auth', auth)
app.use('/api/clientes', requerirSesion, clientes) // todo lo de clientes exige sesión

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`))
