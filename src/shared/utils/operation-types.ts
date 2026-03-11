import type { OperationType, OperationTypeInfo, RiskLevel, RiskLevelInfo } from '../types'

/**
 * Single source of truth for operation type metadata.
 * Previously duplicated in GestionProyectos, ProjectList, and ProjectNameForm.
 */
export const OPERATION_TYPES: Record<OperationType, OperationTypeInfo> = {
  manufacturing: {
    name: 'Manufactura',
    description: 'Procesos de Producción',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  logistics: {
    name: 'Logística',
    description: 'Cadena de Suministro',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  infrastructure: {
    name: 'Infraestructura',
    description: 'Construcción y Desarrollo',
    color: '#10b981',
    bgColor: '#dcfce7',
  },
  billing: {
    name: 'Facturación',
    description: 'Gestión Financiera',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  business: {
    name: 'Negocio',
    description: 'Estrategia y Análisis',
    color: '#06b6d4',
    bgColor: '#cffafe',
  },
  marketing: {
    name: 'Marketing',
    description: 'Promoción y Ventas',
    color: '#ec4899',
    bgColor: '#fce7f3',
  },
  hr: {
    name: 'Recursos Humanos',
    description: 'Gestión de Personal',
    color: '#84cc16',
    bgColor: '#ecfccb',
  },
  sales: {
    name: 'Ventas',
    description: 'Canal Comercial',
    color: '#f97316',
    bgColor: '#fed7aa',
  },
  finance: {
    name: 'Finanzas',
    description: 'Análisis Financiero',
    color: '#6366f1',
    bgColor: '#e0e7ff',
  },
  research: {
    name: 'Investigación',
    description: 'I+D+i',
    color: '#14b8a6',
    bgColor: '#ccfbf1',
  },
  support: {
    name: 'Soporte',
    description: 'Atención al Cliente',
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
}

export const OPERATION_CATEGORIES = [
  {
    title: 'Operaciones Core',
    types: ['manufacturing', 'logistics', 'infrastructure'] as OperationType[],
  },
  {
    title: 'Gestión Empresarial',
    types: ['business', 'finance', 'billing', 'hr'] as OperationType[],
  },
  {
    title: 'Cliente y Mercado',
    types: ['sales', 'marketing', 'support', 'research'] as OperationType[],
  },
]

export function getOperationTypeInfo(type: OperationType): OperationTypeInfo {
  return OPERATION_TYPES[type] ?? OPERATION_TYPES.manufacturing
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelInfo> = {
  low: { color: '#10b981', bgColor: '#dcfce7', label: 'Bajo' },
  medium: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Medio' },
  high: { color: '#ef4444', bgColor: '#fee2e2', label: 'Alto' },
}

export function getRiskLevelInfo(level: RiskLevel): RiskLevelInfo {
  return RISK_LEVELS[level] ?? RISK_LEVELS.medium
}
