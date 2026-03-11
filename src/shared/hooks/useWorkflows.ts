import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'

type WorkflowRow = Tables<'workflows'>

export interface UseWorkflowsReturn {
  data: WorkflowRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (workflow: TablesInsert<'workflows'>) => Promise<WorkflowRow | null>
  update: (id: string, changes: TablesUpdate<'workflows'>) => Promise<WorkflowRow | null>
  remove: (id: string) => Promise<boolean>
}

export function useWorkflows(organizationId: string | null, projectId?: string): UseWorkflowsReturn {
  const [data, setData] = useState<WorkflowRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflows = useCallback(async () => {
    if (!organizationId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    let query = supabase
      .from('workflows')
      .select('*')
      .eq('organization_id', organizationId)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: rows, error: fetchError } = await query.order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setData([])
    } else {
      setData(rows ?? [])
    }
    setLoading(false)
  }, [organizationId, projectId])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const create = useCallback(async (workflow: TablesInsert<'workflows'>): Promise<WorkflowRow | null> => {
    const { data: row, error: insertError } = await supabase
      .from('workflows')
      .insert(workflow)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setData(prev => [row, ...prev])
    return row
  }, [])

  const update = useCallback(async (id: string, changes: TablesUpdate<'workflows'>): Promise<WorkflowRow | null> => {
    const { data: row, error: updateError } = await supabase
      .from('workflows')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return null
    }

    setData(prev => prev.map(w => w.id === id ? row : w))
    return row
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setData(prev => prev.filter(w => w.id !== id))
    return true
  }, [])

  return { data, loading, error, refetch: fetchWorkflows, create, update, remove }
}
