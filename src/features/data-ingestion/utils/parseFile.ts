import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { detectColumnTypes } from './detectColumnTypes'
import type { ParsedFile } from '../types'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

const ALLOWED_EXTENSIONS = new Set(['csv', 'xlsx', 'xls'])

function getExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function parseCSV(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`Error al parsear CSV: ${results.errors[0].message}`))
          return
        }
        resolve(results.data as Record<string, unknown>[])
      },
      error: (err: Error) => {
        reject(new Error(`Error al parsear CSV: ${err.message}`))
      },
    })
  })
}

function parseExcel(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          reject(new Error('El archivo Excel no contiene hojas'))
          return
        }
        const sheet = workbook.Sheets[firstSheetName]
        const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]
        resolve(rows)
      } catch (err) {
        reject(new Error(`Error al parsear Excel: ${(err as Error).message}`))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = getExtension(file.name)

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('Formato no soportado. Use CSV o Excel (.xlsx)')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo excede el limite de 50MB')
  }

  const isCSV = ext === 'csv'
  const rows = isCSV ? await parseCSV(file) : await parseExcel(file)
  const columns = detectColumnTypes(rows)

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: isCSV ? 'csv' : 'xlsx',
    columns,
    rows,
    totalRows: rows.length,
  }
}
