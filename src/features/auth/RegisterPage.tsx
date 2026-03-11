import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { useAuth } from './AuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    const { error: authError } = await signUp(email, password, orgName || undefined)

    if (authError) {
      setError(authError.message || 'Error al crear la cuenta. Intentá de nuevo.')
      setLoading(false)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
      <div className="w-full max-w-sm space-y-8 rounded-lg border border-[var(--color-border)] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066cc] to-[#004d99]">
            <Activity className="text-white" size={22} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Crear Cuenta
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            DigitalTwin Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-[var(--color-border)] bg-gray-50 px-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-[var(--color-border)] bg-gray-50 px-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="orgName" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Nombre de Organización
              <span className="ml-1 text-[var(--color-text-secondary)] font-normal">(opcional)</span>
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="h-10 w-full rounded-md border border-[var(--color-border)] bg-gray-50 px-3 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Mi Empresa"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-md bg-brand-600 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
