import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import clientes from './routes/clientes.js'

const app = express()

app.use(cors()) 
app.use(express.json())

app.get('/api/salud', async (req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true, baseDeDatos: 'conectada' })
})

app.use('/api/clientes', clientes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`))
