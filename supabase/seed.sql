-- ============================================
-- Seed Data: Demo Organization + Sample Data
-- ============================================
-- Run with: supabase db reset (applies migrations + seed)
--
-- NOTE: This seed does NOT insert into auth.users directly.
-- Supabase Auth manages that table via its own API.
-- To create a test user:
--   1. Start local Supabase: supabase start
--   2. Go to http://localhost:54323 (Supabase Studio)
--   3. Authentication > Users > Add User
--   4. Then run: INSERT INTO organization_members (organization_id, user_id, role)
--      VALUES ('<org-id-below>', '<user-id-from-auth>', 'owner');
--
-- Alternatively, use the registration flow in the app (Phase B)
-- which auto-creates the org + membership.

-- -----------------------------------------------
-- 1. Demo Organization
-- -----------------------------------------------

INSERT INTO public.organizations (id, name, slug, logo_url)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Petro Corp',
  'petro-corp',
  NULL
);

-- -----------------------------------------------
-- 2. Projects
-- -----------------------------------------------

INSERT INTO public.projects (id, organization_id, name, operation_type, status, budget, completion, team_size, location, risk_level, next_milestone, next_milestone_date, real_time_updates)
VALUES
  (
    'a0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Manufacturing Line Alpha',
    'manufacturing',
    'active',
    2500000.00,
    68,
    12,
    'Houston, TX',
    'medium',
    'Phase 2 Completion',
    '2026-04-15',
    true
  ),
  (
    'a0000002-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Logistics Optimization',
    'logistics',
    'planning',
    1800000.00,
    15,
    8,
    'Dallas, TX',
    'low',
    'Requirements Finalization',
    '2026-05-01',
    false
  );

-- -----------------------------------------------
-- 3. Workflows
-- -----------------------------------------------

-- Workflow for Project 1 (Manufacturing)
INSERT INTO public.workflows (id, project_id, organization_id, name, description, total_duration, estimated_cost, risk_score, ai_recommendations)
VALUES (
  'b0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000001',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Manufacturing Pipeline',
  'End-to-end manufacturing workflow from design to quality control',
  '12 weeks',
  '$1.2M',
  6.5,
  '[{"type": "optimization", "message": "Consider parallelizing assembly and testing phases", "priority": "high"}]'::jsonb
);

-- Workflow for Project 2 (Logistics)
INSERT INTO public.workflows (id, project_id, organization_id, name, description, total_duration, estimated_cost, risk_score, ai_recommendations)
VALUES (
  'b0000002-0000-0000-0000-000000000002',
  'a0000002-0000-0000-0000-000000000002',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Supply Chain Flow',
  'Logistics optimization for supply chain operations',
  '8 weeks',
  '$800K',
  4.2,
  '[]'::jsonb
);

-- -----------------------------------------------
-- 4. Workflow Nodes
-- -----------------------------------------------

-- Nodes for Manufacturing Pipeline (workflow 1)
INSERT INTO public.workflow_nodes (workflow_id, organization_id, node_key, name, type, status, duration, cost, progress, position_x, position_y, kpis)
VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'product_design',
    'Product Design',
    'process',
    'completed',
    '3 weeks',
    '$150K',
    100,
    100, 200,
    '{"quality_score": "95%", "iterations": "3"}'::jsonb
  ),
  (
    'b0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'raw_materials',
    'Raw Materials Procurement',
    'input',
    'running',
    '2 weeks',
    '$400K',
    72,
    350, 100,
    '{"supplier_reliability": "98%"}'::jsonb
  ),
  (
    'b0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'assembly',
    'Assembly Line',
    'process',
    'running',
    '4 weeks',
    '$500K',
    45,
    350, 300,
    '{"throughput": "120 units/day", "defect_rate": "0.5%"}'::jsonb
  ),
  (
    'b0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'quality_control',
    'Quality Control',
    'checkpoint',
    'pending',
    '1 week',
    '$50K',
    0,
    600, 200,
    '{}'::jsonb
  );

-- Nodes for Supply Chain Flow (workflow 2)
INSERT INTO public.workflow_nodes (workflow_id, organization_id, node_key, name, type, status, duration, cost, progress, position_x, position_y, kpis)
VALUES
  (
    'b0000002-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'warehouse_intake',
    'Warehouse Intake',
    'input',
    'scheduled',
    '1 week',
    '$50K',
    10,
    100, 200,
    '{}'::jsonb
  ),
  (
    'b0000002-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'route_planning',
    'Route Planning',
    'process',
    'pending',
    '2 weeks',
    '$200K',
    0,
    350, 200,
    '{}'::jsonb
  ),
  (
    'b0000002-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'delivery',
    'Last-Mile Delivery',
    'output',
    'pending',
    '3 weeks',
    '$350K',
    0,
    600, 200,
    '{}'::jsonb
  );

-- -----------------------------------------------
-- 5. Workflow Connections
-- -----------------------------------------------

-- Connections for Manufacturing Pipeline
INSERT INTO public.workflow_connections (workflow_id, organization_id, from_node_key, to_node_key, duration, progress)
VALUES
  ('b0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'product_design', 'raw_materials', '1 day', 100),
  ('b0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'product_design', 'assembly', '1 day', 100),
  ('b0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'raw_materials', 'quality_control', '2 days', 0),
  ('b0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'assembly', 'quality_control', '1 day', 0);

-- Connections for Supply Chain Flow
INSERT INTO public.workflow_connections (workflow_id, organization_id, from_node_key, to_node_key, duration, progress)
VALUES
  ('b0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'warehouse_intake', 'route_planning', '1 day', 0),
  ('b0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'route_planning', 'delivery', '1 day', 0);

-- -----------------------------------------------
-- 6. Data Sources
-- -----------------------------------------------

INSERT INTO public.data_sources (organization_id, project_id, name, type, status, last_sync, records_count, size, description, schema_config)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'a0000001-0000-0000-0000-000000000001',
    'Production Sensors Export',
    'excel',
    'connected',
    now() - interval '2 hours',
    15420,
    '24.5 MB',
    'Monthly export of production line sensor readings',
    '[{"field": "sensor_id", "type": "string", "sample": "SENS-001"}, {"field": "temperature", "type": "number", "sample": 72.5}, {"field": "timestamp", "type": "datetime", "sample": "2026-03-10T14:30:00Z"}]'::jsonb
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'ERP Integration API',
    'api',
    'pending',
    NULL,
    0,
    '0 MB',
    'REST API connection to corporate ERP system',
    '[]'::jsonb
  );

-- -----------------------------------------------
-- 7. KPIs
-- -----------------------------------------------

-- 3 org-level KPIs (no project_id)
INSERT INTO public.kpis (organization_id, project_id, name, description, type, value, unit, target, current_value, change_pct, trend, color, frequency, icon, display_value)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Overall Equipment Effectiveness',
    'Combined availability, performance, and quality metric',
    'percentage',
    85.5,
    '%',
    90.0,
    85.5,
    2.3,
    'up',
    '#22c55e',
    'daily',
    'activity',
    '85.5%'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Total Revenue',
    'Organization-wide revenue across all projects',
    'currency',
    4200000.00,
    'USD',
    5000000.00,
    4200000.00,
    5.1,
    'up',
    '#3b82f6',
    'monthly',
    'dollar-sign',
    '$4.2M'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Active Incidents',
    'Number of unresolved incidents across operations',
    'number',
    7,
    'incidents',
    0,
    7,
    -12.5,
    'down',
    '#ef4444',
    'daily',
    'alert-triangle',
    '7'
  );

-- 2 project-level KPIs
INSERT INTO public.kpis (organization_id, project_id, name, description, type, value, unit, target, current_value, change_pct, trend, color, frequency, linked_node_key, icon, display_value)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'a0000001-0000-0000-0000-000000000001',
    'Assembly Throughput',
    'Daily unit output from the assembly line',
    'number',
    120,
    'units/day',
    150,
    120,
    3.4,
    'up',
    '#8b5cf6',
    'daily',
    'assembly',
    'package',
    '120 units/day'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'a0000001-0000-0000-0000-000000000001',
    'Defect Rate',
    'Percentage of defective units in production',
    'percentage',
    0.5,
    '%',
    0.2,
    0.5,
    -8.0,
    'down',
    '#f59e0b',
    'daily',
    'quality_control',
    'shield-check',
    '0.5%'
  );
