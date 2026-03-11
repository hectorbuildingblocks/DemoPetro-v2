import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export interface Organization {
  id: string
  name: string
  slug: string
  role: 'owner' | 'admin' | 'member'
}

interface AuthState {
  user: User | null
  session: Session | null
  organization: Organization | null
  loading: boolean
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, orgName?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

type AuthContextValue = AuthState & AuthActions

const AuthContext = createContext<AuthContextValue | null>(null)

async function resolveOrganization(userId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(id, name, slug)')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (error || !data) return null

  const org = data.organizations as unknown as { id: string; name: string; slug: string }
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    role: data.role as Organization['role'],
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    organization: null,
    loading: true,
  })

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const org = await resolveOrganization(session.user.id)
        setState({ user: session.user, session, organization: org, loading: false })
      } else {
        setState({ user: null, session: null, organization: null, loading: false })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const org = await resolveOrganization(session.user.id)
          setState({ user: session.user, session, organization: org, loading: false })
        } else {
          setState({ user: null, session: null, organization: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string, orgName?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error || !data.user) return { error }

    // If signUp didn't return a session (e.g. email confirmation enabled),
    // sign in immediately to establish a session so RLS policies work.
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) return { error: signInError }
    }

    // Auto-create organization for new user (Task 2.4 — client-side approach)
    const name = orgName || email.split('@')[0]
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name, slug: `${slug}-${Date.now()}` })
      .select()
      .single()

    if (orgError || !org) {
      return { error: orgError ? { message: orgError.message, name: 'AuthApiError', status: 500 } as AuthError : null }
    }

    await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: data.user.id,
        role: 'owner' as const,
      })

    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
