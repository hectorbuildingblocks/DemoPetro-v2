import { FileSpreadsheet, Table2 } from 'lucide-react'
import type { ParsedFile } from './types'

const TYPE_BADGE_COLORS: Record<string, string> = {
  string: 'bg-gray-100 text-gray-700',
  number: 'bg-blue-100 text-blue-700',
  datetime: 'bg-purple-100 text-purple-700',
  boolean: 'bg-green-100 text-green-700',
}

interface UploadPreviewProps {
  parsedFile: ParsedFile
  datasetName: string
  onDatasetNameChange: (name: string) => void
  onCancel: () => void
  onUpload: () => void
}

export function UploadPreview({
  parsedFile,
  datasetName,
  onDatasetNameChange,
  onCancel,
  onUpload,
}: UploadPreviewProps) {
  const previewRows = parsedFile.rows.slice(0, 10)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
            <FileSpreadsheet size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{parsedFile.fileName}</h3>
            <p className="text-sm text-gray-500">
              {(parsedFile.fileSize / 1024).toFixed(1)} KB &middot; {parsedFile.fileType.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{parsedFile.totalRows}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Filas</div>
          </div>
          <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{parsedFile.columns.length}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Columnas</div>
          </div>
        </div>
      </div>

      {/* Dataset Name */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre del Dataset
        </label>
        <input
          type="text"
          value={datasetName}
          onChange={(e) => onDatasetNameChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingrese un nombre para el dataset..."
        />
      </div>

      {/* Column Schema */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Table2 size={18} className="text-gray-500" />
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Esquema Detectado
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Columna</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {parsedFile.columns.map((col) => (
                <tr key={col.name} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-900">{col.name}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_BADGE_COLORS[col.inferredType] ?? TYPE_BADGE_COLORS.string}`}>
                      {col.inferredType}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500 truncate max-w-[200px]">{col.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Vista Previa (primeras {previewRows.length} filas)
        </h4>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="text-left py-2 px-2 text-gray-500 font-semibold">#</th>
                {parsedFile.columns.map((col) => (
                  <th key={col.name} className="text-left py-2 px-2 text-gray-500 font-semibold whitespace-nowrap">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-1.5 px-2 text-gray-400 font-mono">{idx + 1}</td>
                  {parsedFile.columns.map((col) => (
                    <td key={col.name} className="py-1.5 px-2 text-gray-700 whitespace-nowrap max-w-[150px] truncate">
                      {String(row[col.name] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onUpload}
          disabled={!datasetName.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Subir Datos
        </button>
      </div>
    </div>
  )
}
