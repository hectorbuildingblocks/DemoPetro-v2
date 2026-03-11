import { Routes, Route, Navigate } from 'react-router-dom'

// Auth pages
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'

// Legacy components — will be migrated to TypeScript gradually
import Dashboard from '../Dashboard'
import GestionProyectos from '../GestionProyectos'
import Configuracion from '../Configuracion'
import ReglaAutomatizacion from '../ReglaAutomatizacion'
import DataManagement from '../DataManagement'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects/*" element={<ProtectedRoute><GestionProyectos /></ProtectedRoute>} />
      <Route path="/data" element={<ProtectedRoute><DataManagement /></ProtectedRoute>} />
      <Route path="/automation" element={<ProtectedRoute><ReglaAutomatizacion /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
    </Routes>
  )
}
