import { useState, useRef, useCallback } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { Upload, FileSpreadsheet } from 'lucide-react'

const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

interface FileUploadZoneProps {
  onFileSelected: (file: File) => void
  error?: string | null
}

function validateFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!['csv', 'xlsx', 'xls'].includes(ext)) {
    return 'Formato no soportado. Use CSV o Excel (.xlsx)'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'El archivo excede el limite de 50MB'
  }
  return null
}

export function FileUploadZone({ onFileSelected, error: externalError }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayError = externalError ?? localError

  const handleFile = useCallback((file: File) => {
    setLocalError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    onFileSelected(file)
  }, [onFileSelected])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }, [handleFile])

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-full border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : displayError
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {isDragging ? (
            <FileSpreadsheet size={48} className="text-blue-500" />
          ) : (
            <Upload size={48} className="text-gray-400" />
          )}

          <div>
            <p className="text-lg font-semibold text-gray-700">
              {isDragging ? 'Suelta el archivo aqui' : 'Arrastra archivos CSV o Excel aqui'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              o haz clic para seleccionar un archivo
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-500">.CSV</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-500">.XLSX</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-500">.XLS</span>
          </div>

          <p className="text-xs text-gray-400 mt-1">Tamaño maximo: 50MB</p>
        </div>
      </div>

      {displayError && (
        <div className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{displayError}</p>
        </div>
      )}
    </div>
  )
}
