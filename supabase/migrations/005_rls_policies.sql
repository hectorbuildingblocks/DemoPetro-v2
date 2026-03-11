-- ============================================
-- Migration 005: RLS Policies
-- ============================================
-- Enables Row Level Security on ALL 8 tables and creates
-- per-operation policies using get_user_org_ids() and
-- user_has_org_role() helper functions (from migration 001).
--
-- Policy pattern (ADR-002, ADR-003):
--   SELECT  → any org member
--   INSERT  → owner/admin
--   UPDATE  → owner/admin (or member who created, where applicable)
--   DELETE  → owner/admin only
--
-- Special cases:
--   organizations      → SELECT for members, UPDATE/DELETE for owner only
--   organization_members → SELECT for org members, mutations for owner/admin

-- ===============================
-- 1. organizations
-- ===============================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- SELECT: user is a member of the organization
CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT USING (
    id = ANY(public.get_user_org_ids())
  );

-- INSERT: any authenticated user can create an organization
-- (they become the owner via a separate org_members insert)
CREATE POLICY "organizations_insert" ON public.organizations
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- UPDATE: owner only
CREATE POLICY "organizations_update" ON public.organizations
  FOR UPDATE USING (
    public.user_has_org_role(id, ARRAY['owner']::public.org_role[])
  );

-- DELETE: owner only
CREATE POLICY "organizations_delete" ON public.organizations
  FOR DELETE USING (
    public.user_has_org_role(id, ARRAY['owner']::public.org_role[])
  );

-- ===============================
-- 2. organization_members
-- ===============================

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- SELECT: any org member can see other members
CREATE POLICY "org_members_select" ON public.organization_members
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

-- INSERT: owner/admin can add members, OR the user is adding themselves
-- (needed for registration flow where a new user creates their own membership)
CREATE POLICY "org_members_insert" ON public.organization_members
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
    OR user_id = auth.uid()
  );

-- UPDATE: owner/admin can change roles
CREATE POLICY "org_members_update" ON public.organization_members
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- DELETE: owner/admin can remove members
CREATE POLICY "org_members_delete" ON public.organization_members
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- ===============================
-- 3. projects
-- ===============================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select" ON public.projects
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

CREATE POLICY "projects_insert" ON public.projects
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "projects_update" ON public.projects
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
    OR (
      organization_id = ANY(public.get_user_org_ids())
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "projects_delete" ON public.projects
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- ===============================
-- 4. workflows
-- ===============================

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflows_select" ON public.workflows
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

CREATE POLICY "workflows_insert" ON public.workflows
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "workflows_update" ON public.workflows
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "workflows_delete" ON public.workflows
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- ===============================
-- 5. workflow_nodes
-- ===============================

ALTER TABLE public.workflow_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflow_nodes_select" ON public.workflow_nodes
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

CREATE POLICY "workflow_nodes_insert" ON public.workflow_nodes
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "workflow_nodes_update" ON public.workflow_nodes
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "workflow_nodes_delete" ON public.workflow_nodes
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- ===============================
-- 6. workflow_connections
-- ===============================

ALTER TABLE public.workflow_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflow_connections_select" ON public.workflow_connections
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

CREATE POLICY "workflow_connections_insert" ON public.workflow_connections
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "workflow_connections_update" ON public.workflow_connections
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "workflow_connections_delete" ON public.workflow_connections
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- ===============================
-- 7. data_sources
-- ===============================

ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_sources_select" ON public.data_sources
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

CREATE POLICY "data_sources_insert" ON public.data_sources
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "data_sources_update" ON public.data_sources
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "data_sources_delete" ON public.data_sources
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

-- ===============================
-- 8. kpis
-- ===============================

ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kpis_select" ON public.kpis
  FOR SELECT USING (
    organization_id = ANY(public.get_user_org_ids())
  );

CREATE POLICY "kpis_insert" ON public.kpis
  FOR INSERT WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "kpis_update" ON public.kpis
  FOR UPDATE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );

CREATE POLICY "kpis_delete" ON public.kpis
  FOR DELETE USING (
    public.user_has_org_role(organization_id, ARRAY['owner', 'admin']::public.org_role[])
  );
