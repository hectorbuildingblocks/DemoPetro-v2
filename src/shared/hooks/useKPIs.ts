import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'

type KPIRow = Tables<'kpis'>

export interface UseKPIsReturn {
  data: KPIRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (kpi: TablesInsert<'kpis'>) => Promise<KPIRow | null>
  update: (id: string, changes: TablesUpdate<'kpis'>) => Promise<KPIRow | null>
  remove: (id: string) => Promise<boolean>
}

export function useKPIs(organizationId: string | null, projectId?: string): UseKPIsReturn {
  const [data, setData] = useState<KPIRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKPIs = useCallback(async () => {
    if (!organizationId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    let query = supabase
      .from('kpis')
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
    fetchKPIs()
  }, [fetchKPIs])

  const create = useCallback(async (kpi: TablesInsert<'kpis'>): Promise<KPIRow | null> => {
    const { data: row, error: insertError } = await supabase
      .from('kpis')
      .insert(kpi)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setData(prev => [row, ...prev])
    return row
  }, [])

  const update = useCallback(async (id: string, changes: TablesUpdate<'kpis'>): Promise<KPIRow | null> => {
    const { data: row, error: updateError } = await supabase
      .from('kpis')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return null
    }

    setData(prev => prev.map(k => k.id === id ? row : k))
    return row
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('kpis')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setData(prev => prev.filter(k => k.id !== id))
    return true
  }, [])

  return { data, loading, error, refetch: fetchKPIs, create, update, remove }
}
