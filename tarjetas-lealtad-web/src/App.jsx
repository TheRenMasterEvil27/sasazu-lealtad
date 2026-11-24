import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import ClientList from './pages/ClientList'
import ClientDetail from './pages/ClientDetail'
import AddClient from './pages/AddClient'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<RutaProtegida />}>
            <Route path="/clientes" element={<ClientList />} />
            <Route path="/clientes/:id" element={<ClientDetail />} />
            <Route path="/agregar" element={<AddClient />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
