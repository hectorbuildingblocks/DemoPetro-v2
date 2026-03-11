import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { UploadProgress as UploadProgressType } from './types'

interface UploadProgressProps {
  progress: UploadProgressType
  error: string | null
  isDone: boolean
  onCancel: () => void
  onReset: () => void
}

export function UploadProgress({ progress, error, isDone, onCancel, onReset }: UploadProgressProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200">
        {error ? (
          <XCircle size={40} className="text-red-500" />
        ) : isDone ? (
          <CheckCircle size={40} className="text-green-500" />
        ) : (
          <Loader2 size={40} className="text-blue-500 animate-spin" />
        )}
      </div>

      {/* Title */}
      <div className="text-center">
        {error ? (
          <h3 className="text-lg font-semibold text-red-700">Error en la carga</h3>
        ) : isDone ? (
          <h3 className="text-lg font-semibold text-green-700">Carga completada</h3>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900">Subiendo datos...</h3>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Lote {progress.current} de {progress.total} completado
          </span>
          <span className="text-sm font-bold text-gray-900">{progress.percentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              error
                ? 'bg-red-500'
                : isDone
                  ? 'bg-green-500'
                  : 'bg-blue-500'
            }`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {isDone && (
        <div className="w-full max-w-md px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 font-medium">
            Todos los datos fueron cargados exitosamente.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isDone && !error && (
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        {(isDone || error) && (
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {isDone ? 'Subir Otro Archivo' : 'Intentar de Nuevo'}
          </button>
        )}
      </div>
    </div>
  )
}
