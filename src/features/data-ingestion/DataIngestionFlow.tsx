import { useCallback } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useFileUpload } from '../../shared/hooks/useFileUpload'
import { FileUploadZone } from './FileUploadZone'
import { UploadPreview } from './UploadPreview'
import { UploadProgress } from './UploadProgress'

interface DataIngestionFlowProps {
  onUploadComplete?: () => void
}

export function DataIngestionFlow({ onUploadComplete }: DataIngestionFlowProps) {
  const { organization } = useAuth()
  const { state, parseFile, setDatasetName, upload, cancel, reset } = useFileUpload()

  const handleUpload = useCallback(() => {
    if (!organization?.id) return
    upload(organization.id)
  }, [organization?.id, upload])

  const handleReset = useCallback(() => {
    reset()
    if (state.step === 'done' && onUploadComplete) {
      onUploadComplete()
    }
  }, [reset, state.step, onUploadComplete])

  if (!organization) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Debe iniciar sesion para subir archivos.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(['select', 'preview', 'uploading'] as const).map((stepName, idx) => {
          const labels = ['Seleccionar', 'Vista Previa', 'Carga']
          const stepOrder = { select: 0, preview: 1, uploading: 2, done: 2, error: 2 }
          const currentOrder = stepOrder[state.step] ?? 0
          const isActive = idx === currentOrder
          const isCompleted = idx < currentOrder

          return (
            <div key={stepName} className="flex items-center gap-2">
              {idx > 0 && (
                <div className={`w-8 h-0.5 ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                ${isActive ? 'bg-blue-100 text-blue-700' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-white'}`}>
                  {isCompleted ? '✓' : idx + 1}
                </span>
                {labels[idx]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Step content */}
      {state.step === 'select' && (
        <FileUploadZone onFileSelected={parseFile} />
      )}

      {state.step === 'preview' && state.parsedFile && (
        <UploadPreview
          parsedFile={state.parsedFile}
          datasetName={state.datasetName}
          onDatasetNameChange={setDatasetName}
          onCancel={reset}
          onUpload={handleUpload}
        />
      )}

      {(state.step === 'uploading' || state.step === 'done' || state.step === 'error') && (
        <UploadProgress
          progress={state.progress}
          error={state.error}
          isDone={state.step === 'done'}
          onCancel={cancel}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
