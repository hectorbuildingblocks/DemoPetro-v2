import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'

type ProjectRow = Tables<'projects'>

export interface UseProjectsReturn {
  data: ProjectRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (project: TablesInsert<'projects'>) => Promise<ProjectRow | null>
  update: (id: string, changes: TablesUpdate<'projects'>) => Promise<ProjectRow | null>
  remove: (id: string) => Promise<boolean>
}

export function useProjects(organizationId: string | null): UseProjectsReturn {
  const [data, setData] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!organizationId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data: rows, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setData([])
    } else {
      setData(rows ?? [])
    }
    setLoading(false)
  }, [organizationId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const create = useCallback(async (project: TablesInsert<'projects'>): Promise<ProjectRow | null> => {
    const { data: row, error: insertError } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setData(prev => [row, ...prev])
    return row
  }, [])

  const update = useCallback(async (id: string, changes: TablesUpdate<'projects'>): Promise<ProjectRow | null> => {
    const { data: row, error: updateError } = await supabase
      .from('projects')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return null
    }

    setData(prev => prev.map(p => p.id === id ? row : p))
    return row
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setData(prev => prev.filter(p => p.id !== id))
    return true
  }, [])

  return { data, loading, error, refetch: fetchProjects, create, update, remove }
}
