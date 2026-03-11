# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added — Phase D: Workflow DB Integration
- `src/shared/hooks/useWorkflows.ts` — CRUD hook for `workflows` table. Params: `(organizationId, projectId?)`. Returns `{ data, loading, error, refetch, create, update, remove }`
- `src/shared/hooks/useWorkflowNodes.ts` — CRUD hook for `workflow_nodes` table. Params: `(organizationId, workflowId)`. Same return pattern. Ordered by `created_at` ascending
- `src/shared/hooks/useWorkflowConnections.ts` — CRUD hook for `workflow_connections` table. Params: `(organizationId, workflowId)`. Same return pattern
- `src/shared/hooks/useWorkflowCanvas.ts` — Orchestrator hook composing the 3 CRUD hooks. Handles bidirectional shape mapping between DB schema (`node_key`, `position_x/y`, `from_node_key/to_node_key`) and canvas-compatible shapes (`id`, `position: {x,y}`, `from/to`). Exposes `{ nodes, connections, loading, error, addNode, updateNode, updateNodePosition, removeNode, addConnection, removeConnection, refetch }`. Debounced position save (300ms) on drag end

### Changed — Phase D: Workflow DB Integration
- `src/GestionProyectos.jsx` — Added `useWorkflows` hook. Workflow initialization now prefers DB workflows (matched by `project_id`) over hardcoded templates. Passes `workflowId` and `organizationId` props to `<WorkflowCanvas>`. Hardcoded `getGenericWorkflows()` kept as fallback for projects without DB data
- `src/WorkflowCanvas.jsx` — Accepts `workflowId` and `organizationId` props. Integrates `useWorkflowCanvas` hook. DB data overrides local state on initial load when available. `addNewNode()`, `deleteNode()`, `updateNode()`, connection creation, and drag-end position save all persist to Supabase when `workflowId` is present. Added loading spinner and error banner for DB state. Added TODO comments for `chartData`, `kpis`, and `defaultDataSources` that should eventually migrate to DB

### Added — CSV/Excel Data Ingestion (RF-01)
- `supabase/migrations/006_dataset_rows.sql` — new `dataset_rows` table (id, data_source_id, organization_id, row_number, row_data jsonb) with RLS policies (SELECT for org members, INSERT/UPDATE/DELETE for owner/admin), GIN index on row_data
- `src/features/data-ingestion/types.ts` — ParsedColumn, ParsedFile, UploadStep, UploadState, UploadProgress interfaces
- `src/features/data-ingestion/utils/detectColumnTypes.ts` — column type inference (datetime, number, boolean, string) from first 10 rows via majority vote
- `src/features/data-ingestion/utils/parseFile.ts` — file parser routing CSV to PapaParse and XLSX/XLS to SheetJS, with 50MB size validation and format validation
- `src/features/data-ingestion/FileUploadZone.tsx` — drag-and-drop zone with file picker, format/size validation, visual feedback on drag
- `src/features/data-ingestion/UploadPreview.tsx` — preview screen showing file metadata, editable dataset name, detected schema with type badges, first 10 rows data table
- `src/features/data-ingestion/UploadProgress.tsx` — upload progress bar with batch count, percentage, error/success banners, cancel support
- `src/features/data-ingestion/DataIngestionFlow.tsx` — 3-step wizard orchestrator (select, preview, upload) with step indicator
- `src/features/data-ingestion/index.ts` — barrel exports
- `src/shared/hooks/useDataSources.ts` — CRUD hook for data_sources table following useProjects pattern
- `src/shared/hooks/useFileUpload.ts` — upload state machine hook with batch insert (500 rows/batch), AbortController cancel, data_source lifecycle management

### Changed — CSV/Excel Data Ingestion (RF-01)
- `src/DataManagement.jsx` — added 4th tab "Subir Archivo" rendering DataIngestionFlow, with onUploadComplete callback to switch to sources tab
- `src/lib/database.types.ts` — regenerated from Supabase to include dataset_rows table types
- `package.json` — added papaparse, xlsx, @types/papaparse dependencies

### Added — Phase A: Database Schema + RLS + Types
- 7 custom enum types: `org_role`, `project_status`, `operation_type`, `risk_level`, `node_status`, `data_source_type`, `data_source_status`
- 3 helper functions: `handle_updated_at()`, `get_user_org_ids()` (SECURITY DEFINER), `user_has_org_role()` (SECURITY DEFINER)
- 8 tables: `organizations`, `organization_members`, `projects`, `workflows`, `workflow_nodes`, `workflow_connections`, `data_sources`, `kpis`
- Row Level Security enabled on all 8 tables with 32 policies (SELECT/INSERT/UPDATE/DELETE per table)
- `updated_at` triggers on `organizations`, `projects`, `workflows`, `data_sources`, `kpis`
- Seed data: 1 org (Petro Corp), 2 projects, 2 workflows, 7 nodes, 6 connections, 2 data sources, 5 KPIs
- `src/lib/database.types.ts` — auto-generated TypeScript types from remote Supabase schema (includes Tables, TablesInsert, TablesUpdate, Enums helpers)
- `src/shared/types/index.ts` — added `UUID` type alias
- `src/lib/supabase.ts` — typed client with `createClient<Database>()`

### Added — Phase B: Authentication + Protected Routes
- `src/features/auth/AuthContext.tsx` — `AuthProvider` context + `useAuth()` hook with `signIn`, `signUp`, `signOut`. Session management via `onAuthStateChange`. Org resolution from `organization_members` after auth. Auto-creates organization on signup (client-side)
- `src/features/auth/LoginPage.tsx` — email/password login form, error display, deep link preservation via `location.state`
- `src/features/auth/RegisterPage.tsx` — registration form with email, password (min 6 chars), optional org name. Auto-creates org + membership on success
- `src/features/auth/index.ts` — barrel exports for `AuthProvider`, `useAuth`, `LoginPage`, `RegisterPage`
- `src/shared/components/ProtectedRoute.tsx` — auth gate: loading spinner during session check, redirect to `/login` with preserved location if unauthenticated

### Changed — Phase B: Authentication + Protected Routes
- `src/main.tsx` — wrapped `<App />` with `<AuthProvider>` inside `<BrowserRouter>`
- `src/app/routes.tsx` — added `/login` and `/register` as public routes; all existing routes wrapped with `<ProtectedRoute>`
- `src/app/App.tsx` — replaced hardcoded user (`Dr. Carlos Mendoza`) with real user data from `useAuth()`. Added sign-out button (LogOut icon) in header. Public routes (login/register) render without app shell

### Added — Phase C: Data Hooks
- `src/shared/hooks/useProjects.ts` — `useProjects(organizationId)` hook returning `{ data, loading, error, refetch, create, update, remove }`. Uses typed `TablesInsert`/`TablesUpdate` for mutations
- `src/shared/hooks/useKPIs.ts` — `useKPIs(organizationId, projectId?)` hook with same pattern. Optional `projectId` filter for project-scoped KPIs

### Changed — Phase C: Data Hooks Integration
- `src/GestionProyectos.jsx` — replaced hardcoded project array with `useProjects()` hook. DB rows mapped to component shape (snake_case → camelCase, budget numeric → formatted string). Added loading spinner and error state
- `src/Dashboard.jsx` — replaced hardcoded KPI array with `useKPIs()` hook. DB KPIs mapped to display shape with `ICON_MAP` (string icon names → lucide components). Added loading spinner and error state

### Fixed
- `supabase/seed.sql` — corrected invalid UUID prefixes (`p0000...` → `a0000...`, `w0000...` → `b0000...`). UUIDs must be hex-only characters
- `src/features/auth/AuthContext.tsx` — fixed RLS policy violation on registration. After `signUp()`, if no session is returned (email confirmation enabled), immediately `signInWithPassword()` to establish session before creating organization + membership rows

### Infrastructure
- 6 Supabase migrations applied to remote project: `enums_and_trigger`, `organizations`, `helper_functions`, `projects_workflows`, `datasources_kpis`, `rls_policies`
- Migration order adapted for remote apply (split original `001_enums_and_functions.sql` into enums + helper_functions due to table dependency)
