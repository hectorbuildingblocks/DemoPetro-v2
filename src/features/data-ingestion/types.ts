export interface ParsedColumn {
  name: string
  inferredType: 'string' | 'number' | 'datetime' | 'boolean'
  sample: string
}

export interface ParsedFile {
  fileName: string
  fileSize: number
  fileType: 'csv' | 'xlsx'
  columns: ParsedColumn[]
  rows: Record<string, unknown>[]
  totalRows: number
}

export type UploadStep = 'select' | 'preview' | 'uploading' | 'done' | 'error'

export interface UploadProgress {
  current: number
  total: number
  percentage: number
}

export interface UploadState {
  step: UploadStep
  parsedFile: ParsedFile | null
  datasetName: string
  progress: UploadProgress
  error: string | null
  dataSourceId: string | null
}
