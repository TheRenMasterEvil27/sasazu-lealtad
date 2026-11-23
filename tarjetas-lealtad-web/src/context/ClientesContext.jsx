import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const ClientesContext = createContext(null)

const ordenar = (lista) => [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarClientes = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setClientes(await api.listarClientes())
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  // Pone en la lista la versión más reciente que regresó la API
  function actualizarEnLista(cliente) {
    setClientes((prev) => ordenar([...prev.filter((c) => c.id !== cliente.id), cliente]))
  }

  async function agregarCliente(datos) {
    const cliente = await api.crearCliente(datos)
    actualizarEnLista(cliente)
    return cliente
  }
  async function editarCliente(id, datos) {
    const cliente = await api.editarCliente(id, datos)
    actualizarEnLista(cliente)
    return cliente
  }
  async function registrarConsumo(id, monto) {
    const cliente = await api.registrarConsumo(id, monto)
    actualizarEnLista(cliente)
    return cliente
  }
  async function corregirConsumo(id, consumoId, monto) {
    const cliente = await api.corregirConsumo(id, consumoId, monto)
    actualizarEnLista(cliente)
    return cliente
  }
  async function eliminarConsumo(id, consumoId) {
    const cliente = await api.eliminarConsumo(id, consumoId)
    actualizarEnLista(cliente)
    return cliente
  }

  const value = {
    clientes, cargando, error, recargar: cargarClientes,
    agregarCliente, editarCliente, registrarConsumo, corregirConsumo, eliminarConsumo,
  }

  return <ClientesContext.Provider value={value}>{children}</ClientesContext.Provider>
}

export function useClientes() {
  const context = useContext(ClientesContext)
  if (!context) throw new Error('useClientes debe usarse dentro de <ClientesProvider>')
  return context
}
