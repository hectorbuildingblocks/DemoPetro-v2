import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'

type WorkflowConnectionRow = Tables<'workflow_connections'>

export interface UseWorkflowConnectionsReturn {
  data: WorkflowConnectionRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (connection: TablesInsert<'workflow_connections'>) => Promise<WorkflowConnectionRow | null>
  update: (id: string, changes: TablesUpdate<'workflow_connections'>) => Promise<WorkflowConnectionRow | null>
  remove: (id: string) => Promise<boolean>
}

export function useWorkflowConnections(organizationId: string | null, workflowId: string | null): UseWorkflowConnectionsReturn {
  const [data, setData] = useState<WorkflowConnectionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConnections = useCallback(async () => {
    if (!organizationId || !workflowId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data: rows, error: fetchError } = await supabase
      .from('workflow_connections')
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      setData([])
    } else {
      setData(rows ?? [])
    }
    setLoading(false)
  }, [organizationId, workflowId])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  const create = useCallback(async (connection: TablesInsert<'workflow_connections'>): Promise<WorkflowConnectionRow | null> => {
    const { data: row, error: insertError } = await supabase
      .from('workflow_connections')
      .insert(connection)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setData(prev => [...prev, row])
    return row
  }, [])

  const update = useCallback(async (id: string, changes: TablesUpdate<'workflow_connections'>): Promise<WorkflowConnectionRow | null> => {
    const { data: row, error: updateError } = await supabase
      .from('workflow_connections')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return null
    }

    setData(prev => prev.map(c => c.id === id ? row : c))
    return row
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('workflow_connections')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setData(prev => prev.filter(c => c.id !== id))
    return true
  }, [])

  return { data, loading, error, refetch: fetchConnections, create, update, remove }
}
