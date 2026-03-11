import { useMemo, useCallback, useRef } from 'react'
import { useWorkflowNodes } from './useWorkflowNodes'
import { useWorkflowConnections } from './useWorkflowConnections'
import type { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types'
import type { Json } from '../../lib/database.types'

// ── Canvas-compatible shapes (what WorkflowCanvas.jsx expects) ──

export interface CanvasNode {
  id: string
  name: string
  type: string
  status: string
  duration: string
  cost: string
  progress: number
  position: { x: number; y: number }
  kpis: Record<string, string>
  description?: string
  priority?: string
  owner?: string
}

export interface CanvasConnection {
  id: string
  from: string
  to: string
  duration?: string
  progress: number
}

export interface UseWorkflowCanvasReturn {
  nodes: CanvasNode[]
  connections: CanvasConnection[]
  loading: boolean
  error: string | null
  addNode: (type: string, position: { x: number; y: number }, name?: string) => Promise<CanvasNode | null>
  updateNode: (nodeKey: string, changes: Partial<CanvasNode>) => Promise<boolean>
  updateNodePosition: (nodeKey: string, position: { x: number; y: number }) => void
  removeNode: (nodeKey: string) => Promise<boolean>
  addConnection: (fromNodeKey: string, toNodeKey: string) => Promise<CanvasConnection | null>
  removeConnection: (connectionId: string) => Promise<boolean>
  refetch: () => Promise<void>
}

// ── Mapper functions ──

function dbNodeToCanvas(row: Tables<'workflow_nodes'>): CanvasNode {
  return {
    id: row.node_key,
    name: row.name,
    type: row.type,
    status: row.status,
    duration: row.duration ?? '',
    cost: row.cost ?? '',
    progress: row.progress,
    position: { x: row.position_x, y: row.position_y },
    kpis: (row.kpis as Record<string, string>) ?? {},
  }
}

function dbConnectionToCanvas(row: Tables<'workflow_connections'>): CanvasConnection {
  return {
    id: row.id,
    from: row.from_node_key,
    to: row.to_node_key,
    duration: row.duration ?? undefined,
    progress: row.progress,
  }
}

// ── Hook ──

export function useWorkflowCanvas(
  workflowId: string | null,
  organizationId: string | null
): UseWorkflowCanvasReturn {
  const {
    data: nodeRows,
    loading: nodesLoading,
    error: nodesError,
    create: createNode,
    update: updateNodeRow,
    remove: removeNodeRow,
    refetch: refetchNodes,
  } = useWorkflowNodes(organizationId, workflowId)

  const {
    data: connectionRows,
    loading: connectionsLoading,
    error: connectionsError,
    create: createConnection,
    remove: removeConnectionRow,
    refetch: refetchConnections,
  } = useWorkflowConnections(organizationId, workflowId)

  // Debounce ref for position saves
  const positionTimerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Map DB rows → canvas shapes
  const nodes = useMemo(() => nodeRows.map(dbNodeToCanvas), [nodeRows])
  const connections = useMemo(() => connectionRows.map(dbConnectionToCanvas), [connectionRows])

  const loading = nodesLoading || connectionsLoading
  const error = nodesError || connectionsError

  // ── Mutations ──

  const addNode = useCallback(async (
    type: string,
    position: { x: number; y: number },
    name?: string
  ): Promise<CanvasNode | null> => {
    if (!workflowId || !organizationId) return null

    const nodeKey = `node_${Date.now()}`
    const insert: TablesInsert<'workflow_nodes'> = {
      workflow_id: workflowId,
      organization_id: organizationId,
      node_key: nodeKey,
      name: name ?? `Nuevo ${type}`,
      type,
      status: 'pending',
      position_x: Math.round(position.x),
      position_y: Math.round(position.y),
      progress: 0,
      kpis: {} as Json,
    }

    const row = await createNode(insert)
    if (!row) return null
    return dbNodeToCanvas(row)
  }, [workflowId, organizationId, createNode])

  const updateNode = useCallback(async (
    nodeKey: string,
    changes: Partial<CanvasNode>
  ): Promise<boolean> => {
    const dbRow = nodeRows.find(r => r.node_key === nodeKey)
    if (!dbRow) return false

    const dbChanges: TablesUpdate<'workflow_nodes'> = {}
    if (changes.name !== undefined) dbChanges.name = changes.name
    if (changes.type !== undefined) dbChanges.type = changes.type
    if (changes.status !== undefined) dbChanges.status = changes.status as TablesUpdate<'workflow_nodes'>['status']
    if (changes.duration !== undefined) dbChanges.duration = changes.duration
    if (changes.cost !== undefined) dbChanges.cost = changes.cost
    if (changes.progress !== undefined) dbChanges.progress = changes.progress
    if (changes.kpis !== undefined) dbChanges.kpis = changes.kpis as Json
    if (changes.position !== undefined) {
      dbChanges.position_x = Math.round(changes.position.x)
      dbChanges.position_y = Math.round(changes.position.y)
    }

    const result = await updateNodeRow(dbRow.id, dbChanges)
    return result !== null
  }, [nodeRows, updateNodeRow])

  const updateNodePosition = useCallback((
    nodeKey: string,
    position: { x: number; y: number }
  ) => {
    // Clear any pending timer for this node
    if (positionTimerRef.current[nodeKey]) {
      clearTimeout(positionTimerRef.current[nodeKey])
    }

    // Debounce: save after 300ms of inactivity (or on next call with different key)
    positionTimerRef.current[nodeKey] = setTimeout(async () => {
      const dbRow = nodeRows.find(r => r.node_key === nodeKey)
      if (!dbRow) return

      await updateNodeRow(dbRow.id, {
        position_x: Math.round(position.x),
        position_y: Math.round(position.y),
      })

      delete positionTimerRef.current[nodeKey]
    }, 300)
  }, [nodeRows, updateNodeRow])

  const removeNode = useCallback(async (nodeKey: string): Promise<boolean> => {
    const dbRow = nodeRows.find(r => r.node_key === nodeKey)
    if (!dbRow) return false

    // Delete all connections referencing this node
    const relatedConnections = connectionRows.filter(
      c => c.from_node_key === nodeKey || c.to_node_key === nodeKey
    )
    for (const conn of relatedConnections) {
      await removeConnectionRow(conn.id)
    }

    return removeNodeRow(dbRow.id)
  }, [nodeRows, connectionRows, removeNodeRow, removeConnectionRow])

  const addConnection = useCallback(async (
    fromNodeKey: string,
    toNodeKey: string
  ): Promise<CanvasConnection | null> => {
    if (!workflowId || !organizationId) return null

    const insert: TablesInsert<'workflow_connections'> = {
      workflow_id: workflowId,
      organization_id: organizationId,
      from_node_key: fromNodeKey,
      to_node_key: toNodeKey,
      progress: 0,
    }

    const row = await createConnection(insert)
    if (!row) return null
    return dbConnectionToCanvas(row)
  }, [workflowId, organizationId, createConnection])

  const removeConnection = useCallback(async (connectionId: string): Promise<boolean> => {
    return removeConnectionRow(connectionId)
  }, [removeConnectionRow])

  const refetch = useCallback(async () => {
    await Promise.all([refetchNodes(), refetchConnections()])
  }, [refetchNodes, refetchConnections])

  return {
    nodes,
    connections,
    loading,
    error,
    addNode,
    updateNode,
    updateNodePosition,
    removeNode,
    addConnection,
    removeConnection,
    refetch,
  }
}
