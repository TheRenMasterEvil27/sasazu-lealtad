import { Router } from 'express'
import { pool } from '../db.js'
import { armarCliente } from '../tarjeta.js'

const router = Router()

const SQL_CLIENTES = `
  SELECT c.id, c.nombre, c.telefono, c.fecha_registro,
         COALESCE(SUM(co.monto), 0) AS total_gastado
  FROM clientes c
  LEFT JOIN consumos co ON co.cliente_id = c.id
`

async function obtenerCliente(id) {
  const [filas] = await pool.query(`${SQL_CLIENTES} WHERE c.id = ? GROUP BY c.id`, [id])
  if (filas.length === 0) return null

  const cliente = armarCliente(filas[0])
  const [consumos] = await pool.query(
    'SELECT id, monto, fecha FROM consumos WHERE cliente_id = ? ORDER BY fecha DESC, id DESC',
    [id]
  )
  cliente.historial = consumos.map((c) => ({ id: c.id, monto: Number(c.monto), fecha: c.fecha }))
  return cliente
}

// GET /api/clientes?buscar=maria  -> lista (con búsqueda opcional por nombre o teléfono)
router.get('/', async (req, res) => {
  const buscar = (req.query.buscar ?? '').trim()
  const filtro = buscar ? 'WHERE c.nombre LIKE ? OR c.telefono LIKE ?' : ''
  const params = buscar ? [`%${buscar}%`, `%${buscar}%`] : []
  const [filas] = await pool.query(`${SQL_CLIENTES} ${filtro} GROUP BY c.id ORDER BY c.nombre`, params)
  res.json(filas.map(armarCliente))
})

// GET /api/clientes/:id  -> un cliente con su historial
router.get('/:id', async (req, res) => {
  const cliente = await obtenerCliente(req.params.id)
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })
  res.json(cliente)
})

// POST /api/clientes  { nombre, telefono, consumoInicial? }
router.post('/', async (req, res) => {
  const { nombre, telefono, consumoInicial } = req.body
  if (!nombre?.trim() || !telefono?.trim()) {
    return res.status(400).json({ error: 'nombre y telefono son obligatorios' })
  }

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [r] = await conn.query('INSERT INTO clientes (nombre, telefono) VALUES (?, ?)', [
      nombre.trim(),
      telefono.trim(),
    ])
    const monto = Number(consumoInicial)
    if (monto > 0) {
      await conn.query('INSERT INTO consumos (cliente_id, monto) VALUES (?, ?)', [r.insertId, monto])
    }
    await conn.commit()
    res.status(201).json(await obtenerCliente(r.insertId))
  } catch (err) {
    await conn.rollback()
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un cliente con ese teléfono' })
    }
    throw err
  } finally {
    conn.release()
  }
})

// PUT /api/clientes/:id  { nombre, telefono }  -> corregir datos del cliente
router.put('/:id', async (req, res) => {
  const { nombre, telefono } = req.body
  if (!nombre?.trim() || !telefono?.trim()) {
    return res.status(400).json({ error: 'nombre y telefono son obligatorios' })
  }
  try {
    const [r] = await pool.query('UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?', [
      nombre.trim(),
      telefono.trim(),
      req.params.id,
    ])
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(await obtenerCliente(req.params.id))
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un cliente con ese teléfono' })
    }
    throw err
  }
})

// POST /api/clientes/:id/consumos  { monto }  -> registrar un consumo
router.post('/:id/consumos', async (req, res) => {
  const monto = Number(req.body.monto)
  if (!(monto > 0)) return res.status(400).json({ error: 'monto debe ser mayor a 0' })

  const [existe] = await pool.query('SELECT id FROM clientes WHERE id = ?', [req.params.id])
  if (existe.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' })

  await pool.query('INSERT INTO consumos (cliente_id, monto) VALUES (?, ?)', [req.params.id, monto])
  res.status(201).json(await obtenerCliente(req.params.id))
})

// PUT /api/clientes/:id/consumos/:consumoId  { monto }  -> corregir el monto de un consumo
router.put('/:id/consumos/:consumoId', async (req, res) => {
  const monto = Number(req.body.monto)
  if (!(monto > 0)) return res.status(400).json({ error: 'monto debe ser mayor a 0' })

  const [r] = await pool.query('UPDATE consumos SET monto = ? WHERE id = ? AND cliente_id = ?', [
    monto,
    req.params.consumoId,
    req.params.id,
  ])
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Consumo no encontrado' })
  res.json(await obtenerCliente(req.params.id))
})

// DELETE /api/clientes/:id/consumos/:consumoId  -> borrar un consumo capturado por error
router.delete('/:id/consumos/:consumoId', async (req, res) => {
  const [r] = await pool.query('DELETE FROM consumos WHERE id = ? AND cliente_id = ?', [
    req.params.consumoId,
    req.params.id,
  ])
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Consumo no encontrado' })
  res.json(await obtenerCliente(req.params.id))
})

export default router
