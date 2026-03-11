import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BarChart3, FolderPlus, Settings, Airplay, Database,
  Bell, Search, Menu, LogOut,
} from 'lucide-react'

import NavigationMenu from '../NavigationMenu'
import { AppRoutes } from './routes'
import { useAuth } from '../features/auth/AuthContext'

const NAVIGATION_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Centro de Control', icon: BarChart3, notifications: 0 },
  { id: 'projects', path: '/projects', label: 'Gestión de Proyectos', icon: FolderPlus, notifications: 2 },
  { id: 'data', path: '/data', label: 'Gestión de Datos', icon: Database, notifications: 0 },
  { id: 'automation', path: '/automation', label: 'Automatizaciones', icon: Airplay, notifications: 0 },
  { id: 'configuration', path: '/settings', label: 'Configuración', icon: Settings, notifications: 0 },
]

function getInitials(email: string): string {
  const name = email.split('@')[0]
  const parts = name.split(/[._-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user: authUser, organization, session, signOut } = useAuth()

  // If on public routes (login/register), render only routes without shell
  if (!session && (location.pathname === '/login' || location.pathname === '/register')) {
    return <AppRoutes />
  }

  const user = {
    name: authUser?.user_metadata?.full_name || authUser?.email || 'Usuario',
    role: organization?.role || 'member',
    avatar: getInitials(authUser?.email || 'U'),
    notifications: 0,
  }

  // Derive active section from current route
  const activeSection = NAVIGATION_ITEMS.find(
    item => location.pathname.startsWith(item.path)
  )?.id ?? 'dashboard'

  const handleNavigation = (sectionId: string) => {
    const item = NAVIGATION_ITEMS.find(i => i.id === sectionId)
    if (item) navigate(item.path)
  }

  return (
    <div className="flex h-screen bg-[var(--color-surface)] font-sans text-[var(--color-text-primary)]">
      <NavigationMenu
        activeSection={activeSection}
        setActiveSection={(id: string) => {
          handleNavigation(id)
          setSidebarOpen(false)
        }}
        navigationItems={NAVIGATION_ITEMS}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden rounded p-2 text-[var(--color-text-secondary)] hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold">
              {NAVIGATION_ITEMS.find(item => item.id === activeSection)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:flex items-center">
              <Search className="absolute left-3 text-[var(--color-text-secondary)]" size={16} />
              <input
                type="text"
                className="h-9 w-70 rounded-md border border-[var(--color-border)] bg-gray-50 pl-10 pr-4 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10"
                placeholder="Buscar proyectos, datos, usuarios..."
              />
            </div>

            <button className="relative rounded-md p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--color-text-primary)]">
              <Bell size={18} />
              {user.notifications > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-semibold text-white">
                  {user.notifications}
                </span>
              )}
            </button>

            <button
              onClick={() => signOut()}
              className="rounded-md p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--color-text-primary)]"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-surface)] p-6">
          <AppRoutes />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
