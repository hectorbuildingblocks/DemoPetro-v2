import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'

type DataSourceRow = Tables<'data_sources'>

export interface UseDataSourcesReturn {
  data: DataSourceRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (dataSource: TablesInsert<'data_sources'>) => Promise<DataSourceRow | null>
  update: (id: string, changes: TablesUpdate<'data_sources'>) => Promise<DataSourceRow | null>
  remove: (id: string) => Promise<boolean>
}

export function useDataSources(organizationId: string | null, projectId?: string | null): UseDataSourcesReturn {
  const [data, setData] = useState<DataSourceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDataSources = useCallback(async () => {
    if (!organizationId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    let query = supabase
      .from('data_sources')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: rows, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setData([])
    } else {
      setData(rows ?? [])
    }
    setLoading(false)
  }, [organizationId, projectId])

  useEffect(() => {
    fetchDataSources()
  }, [fetchDataSources])

  const create = useCallback(async (dataSource: TablesInsert<'data_sources'>): Promise<DataSourceRow | null> => {
    const { data: row, error: insertError } = await supabase
      .from('data_sources')
      .insert(dataSource)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setData(prev => [row, ...prev])
    return row
  }, [])

  const update = useCallback(async (id: string, changes: TablesUpdate<'data_sources'>): Promise<DataSourceRow | null> => {
    const { data: row, error: updateError } = await supabase
      .from('data_sources')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return null
    }

    setData(prev => prev.map(d => d.id === id ? row : d))
    return row
  }, [])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('data_sources')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return false
    }

    setData(prev => prev.filter(d => d.id !== id))
    return true
  }, [])

  return { data, loading, error, refetch: fetchDataSources, create, update, remove }
}
