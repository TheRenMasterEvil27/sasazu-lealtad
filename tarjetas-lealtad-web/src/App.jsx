import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClientesProvider } from './context/ClientesContext'
import Login from './pages/Login'
import ClientList from './pages/ClientList'
import ClientDetail from './pages/ClientDetail'
import AddClient from './pages/AddClient'

export default function App() {
  return (
    <ClientesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/clientes" element={<ClientList />} />
          <Route path="/clientes/:id" element={<ClientDetail />} />
          <Route path="/agregar" element={<AddClient />} />
        </Routes>
      </BrowserRouter>
    </ClientesProvider>
  )
}
