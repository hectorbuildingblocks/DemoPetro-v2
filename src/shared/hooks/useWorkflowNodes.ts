import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'

type WorkflowNodeRow = Tables<'workflow_nodes'>

export interface UseWorkflowNodesReturn {
  data: WorkflowNodeRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (node: TablesInsert<'workflow_nodes'>) => Promise<WorkflowNodeRow | null>
  update: (id: string, changes: TablesUpdate<'workflow_nodes'>) => Promise<WorkflowNodeRow | null>
  remove: (id: string) => Promise<boolean>
}

export function useWorkflowNodes(organizationId: string | null, workflowId: string | null): UseWorkflowNodesReturn {
  const [data, setData] = useState<WorkflowNodeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNodes = useCallback(async () => {
    if (!organizationId || !workflowId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data: rows, error: fetchError } = await supabase
      .from('workflow_nodes')
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
    fetchNodes()
  }, [fetchNodes])

  const create = useCallback(async (node: TablesInsert<'workflow_nodes'>): Promise<WorkflowNodeRow | null> => {
    const { data: row, error: insertError } = await supabase
      .from('workflow_nodes')
      .insert(node)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setData(prev => [...prev, row])
    return row
  }, [])

  const update = useCallback(async (id: string, changes: TablesUpdate<'workflow_nodes'>): Promise<WorkflowNodeRow | null> => {
    const { data: row, error: updateError } = await supabase
      .from('workflow_nodes')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return null
    }

    setData(prev => prev.map(n => n.id === id ? row : n))
    return row
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('workflow_nodes')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setData(prev => prev.filter(n => n.id !== id))
    return true
  }, [])

  return { data, loading, error, refetch: fetchNodes, create, update, remove }
}
