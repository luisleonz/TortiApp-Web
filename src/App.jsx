import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { StoreProvider } from './store/context'
import { auth } from './utils/storage'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Empleados from './pages/Empleados'
import EmpleadoForm from './pages/EmpleadoForm'
import Tarifas from './pages/Tarifas'
import Asistencia from './pages/Asistencia'
import Nomina from './pages/Nomina'
import NominaForm from './pages/NominaForm'
import Historial from './pages/Historial'
import Config from './pages/Config'

function AuthGuard({ children }) {
  const { pathname } = useLocation()
  if (!auth.get() && pathname !== '/login') return <Navigate to="/login" replace />
  if (auth.get() && pathname === '/login') return <Navigate to="/empleados" replace />
  return children
}

function AppRoutes() {
  const isPublic = useLocation().pathname === '/login'
  return (
    <AuthGuard>
      {isPublic ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/empleados" replace />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/empleados/nuevo" element={<EmpleadoForm />} />
            <Route path="/empleados/:id" element={<EmpleadoForm />} />
            <Route path="/tarifas" element={<Tarifas />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/nomina" element={<Nomina />} />
            <Route path="/nomina/:id" element={<NominaForm />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/historial/:semana" element={<Historial />} />
            <Route path="/config" element={<Config />} />
          </Routes>
        </Layout>
      )}
    </AuthGuard>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
