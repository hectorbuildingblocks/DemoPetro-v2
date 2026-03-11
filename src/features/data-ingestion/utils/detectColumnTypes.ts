import type { ParsedColumn } from '../types'

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?/
const BOOLEAN_VALUES = new Set(['true', 'false', 'TRUE', 'FALSE', 'True', 'False', '1', '0'])

function inferType(value: unknown): 'datetime' | 'number' | 'boolean' | 'string' {
  if (value === null || value === undefined || value === '') return 'string'

  const str = String(value).trim()

  if (ISO_DATE_REGEX.test(str)) return 'datetime'
  if (BOOLEAN_VALUES.has(str)) return 'boolean'

  const num = Number(str)
  if (!isNaN(num) && str !== '') return 'number'

  return 'string'
}

/**
 * Samples the first 10 rows and infers a type per column via majority vote.
 */
export function detectColumnTypes(rows: Record<string, unknown>[]): ParsedColumn[] {
  if (rows.length === 0) return []

  const sampleRows = rows.slice(0, 10)
  const columnNames = Object.keys(rows[0])

  return columnNames.map((name) => {
    const typeCounts: Record<string, number> = { string: 0, number: 0, datetime: 0, boolean: 0 }

    for (const row of sampleRows) {
      const value = row[name]
      if (value === null || value === undefined || value === '') continue
      typeCounts[inferType(value)]++
    }

    // Pick the type with the most non-empty votes, defaulting to string
    let bestType: ParsedColumn['inferredType'] = 'string'
    let bestCount = 0
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > bestCount) {
        bestCount = count
        bestType = type as ParsedColumn['inferredType']
      }
    }

    const sample = String(sampleRows[0][name] ?? '')

    return { name, inferredType: bestType, sample }
  })
}
