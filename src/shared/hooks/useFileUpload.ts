import { useState, useCallback, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { parseFile as parseFileUtil } from '../../features/data-ingestion/utils/parseFile'
import type { UploadState, ParsedFile } from '../../features/data-ingestion/types'
import type { Json } from '../../lib/database.types'

const BATCH_SIZE = 500

export interface UseFileUploadReturn {
  state: UploadState
  parseFile: (file: File) => Promise<void>
  setDatasetName: (name: string) => void
  upload: (organizationId: string, projectId?: string) => Promise<void>
  cancel: () => void
  reset: () => void
}

const initialState: UploadState = {
  step: 'select',
  parsedFile: null,
  datasetName: '',
  progress: { current: 0, total: 0, percentage: 0 },
  error: null,
  dataSourceId: null,
}

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<UploadState>(initialState)
  const abortRef = useRef<AbortController | null>(null)
  const parsedFileRef = useRef<ParsedFile | null>(null)
  const datasetNameRef = useRef('')

  const parseFile = useCallback(async (file: File) => {
    try {
      setState(prev => ({ ...prev, step: 'select', error: null }))
      const parsed: ParsedFile = await parseFileUtil(file)
      const defaultName = file.name.replace(/\.[^.]+$/, '')
      parsedFileRef.current = parsed
      datasetNameRef.current = defaultName
      setState(prev => ({
        ...prev,
        step: 'preview',
        parsedFile: parsed,
        datasetName: defaultName,
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        step: 'error',
        error: (err as Error).message,
      }))
    }
  }, [])

  const setDatasetName = useCallback((name: string) => {
    datasetNameRef.current = name
    setState(prev => ({ ...prev, datasetName: name }))
  }, [])

  const upload = useCallback(async (organizationId: string, projectId?: string) => {
    const parsedFile = parsedFileRef.current
    const datasetName = datasetNameRef.current
    if (!parsedFile) return

    const controller = new AbortController()
    abortRef.current = controller
    const totalBatches = Math.ceil(parsedFile.totalRows / BATCH_SIZE)

    setState(prev => ({
      ...prev,
      step: 'uploading',
      progress: { current: 0, total: totalBatches, percentage: 0 },
      error: null,
    }))

    try {
      // 1. Create data_source record
      const schemaConfig = parsedFile.columns.map(col => ({
        name: col.name,
        type: col.inferredType,
        sample: col.sample,
      }))

      const { data: dataSource, error: dsError } = await supabase
        .from('data_sources')
        .insert({
          name: datasetName || parsedFile.fileName,
          type: 'excel' as const,
          status: 'pending' as const,
          organization_id: organizationId,
          project_id: projectId ?? null,
          schema_config: schemaConfig as unknown as Json,
          connection_config: { file_type: parsedFile.fileType, file_name: parsedFile.fileName, file_size: parsedFile.fileSize } as unknown as Json,
          records_count: 0,
        })
        .select()
        .single()

      if (dsError || !dataSource) {
        throw new Error(dsError?.message ?? 'Error al crear fuente de datos')
      }

      setState(prev => ({ ...prev, dataSourceId: dataSource.id }))

      // 2. Insert rows in batches
      for (let i = 0; i < totalBatches; i++) {
        if (controller.signal.aborted) {
          throw new Error('Carga cancelada por el usuario')
        }

        const start = i * BATCH_SIZE
        const end = Math.min(start + BATCH_SIZE, parsedFile.totalRows)
        const batchRows = parsedFile.rows.slice(start, end)

        const batchPayload = batchRows.map((row, idx) => ({
          data_source_id: dataSource.id,
          organization_id: organizationId,
          row_number: start + idx + 1,
          row_data: row as unknown as Json,
        }))

        const { error: insertError } = await supabase
          .from('dataset_rows')
          .insert(batchPayload)

        if (insertError) {
          // Mark data_source as error
          await supabase
            .from('data_sources')
            .update({ status: 'error' as const })
            .eq('id', dataSource.id)

          throw new Error(`Error en la carga: fallo en lote ${i + 1} de ${totalBatches}`)
        }

        const completed = i + 1
        setState(prev => ({
          ...prev,
          progress: {
            current: completed,
            total: totalBatches,
            percentage: Math.round((completed / totalBatches) * 100),
          },
        }))
      }

      // 3. Update data_source to connected
      await supabase
        .from('data_sources')
        .update({
          status: 'connected' as const,
          records_count: parsedFile.totalRows,
          last_sync: new Date().toISOString(),
        })
        .eq('id', dataSource.id)

      setState(prev => ({
        ...prev,
        step: 'done',
        progress: { current: totalBatches, total: totalBatches, percentage: 100 },
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        step: 'error',
        error: (err as Error).message,
      }))
    } finally {
      abortRef.current = null
    }
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setState(prev => ({
      ...prev,
      step: 'error',
      error: 'Carga cancelada por el usuario',
    }))
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState(initialState)
  }, [])

  return { state, parseFile, setDatasetName, upload, cancel, reset }
}
