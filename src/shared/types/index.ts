// ============================================
// Domain Types — Digital Twin Platform
// ============================================

// UUID alias for clarity — all database PKs are UUID v4 strings.
// Existing interfaces use `id: number | string` which already accepts UUIDs.
export type UUID = string

export type OperationType =
  | 'manufacturing'
  | 'logistics'
  | 'infrastructure'
  | 'billing'
  | 'business'
  | 'marketing'
  | 'hr'
  | 'sales'
  | 'finance'
  | 'research'
  | 'support'

export type RiskLevel = 'low' | 'medium' | 'high'

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'

export type NodeStatus = 'pending' | 'scheduled' | 'running' | 'completed' | 'error'

export type DataSourceType = 'excel' | 'database' | 'api' | 'cloud' | 'iot'

export type DataSourceStatus = 'connected' | 'warning' | 'error' | 'pending'

// ============================================
// Core Entities
// ============================================

export interface Project {
  id: number | string
  name: string
  operationType: OperationType
  status: ProjectStatus
  budget: string
  completion: number
  team: number
  location: string
  riskLevel: RiskLevel
  nextMilestone: string
  nextMilestoneDate: string
  createdAt: string
  lastModified: string
  realTimeUpdates: boolean
  workflow: Workflow | null
  data: ProjectData | null
}

export interface Workflow {
  name: string
  description: string
  totalDuration: string
  estimatedCost: string
  riskScore: number
  aiRecommendations: AIRecommendation[]
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
}

export interface WorkflowNode {
  id: string
  name: string
  type: string
  status: NodeStatus
  duration: string
  cost: string
  progress: number
  position: { x: number; y: number }
  kpis: Record<string, string>
}

export interface WorkflowConnection {
  from: string
  to: string
  duration: string
  progress: number
}

export interface AIRecommendation {
  type: string
  message: string
  priority: string
}

export interface SchemaField {
  field: string
  type: 'string' | 'number' | 'datetime' | 'percentage' | 'currency' | 'boolean'
  sample: string | number
}

export interface ProjectData {
  schema: SchemaField[]
  records: Record<string, unknown>[]
}

export interface DataSource {
  id: number | string
  name: string
  type: DataSourceType
  status: DataSourceStatus
  lastSync: string | null
  records: number
  size: string
  description: string
  schema: SchemaField[]
}

export interface KPI {
  id: string | number
  name: string
  description: string
  value: number
  unit: string
  target: number
  change: number
  trend: 'up' | 'down' | 'stable'
  color: string
  frequency: string
}

export interface OperationTypeInfo {
  name: string
  description: string
  color: string
  bgColor: string
}

export interface RiskLevelInfo {
  color: string
  bgColor: string
  label: string
}
