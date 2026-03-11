-- ============================================
-- Migration 001: Enum Types + Helper Functions
-- ============================================
-- Creates all custom enum types and shared utility functions
-- used across the schema.

-- -----------------------------------------------
-- Enum Types
-- -----------------------------------------------

CREATE TYPE public.org_role AS ENUM ('owner', 'admin', 'member');

CREATE TYPE public.project_status AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled');

CREATE TYPE public.operation_type AS ENUM (
  'manufacturing', 'logistics', 'infrastructure', 'billing',
  'business', 'marketing', 'hr', 'sales', 'finance', 'research', 'support'
);

CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high');

CREATE TYPE public.node_status AS ENUM ('pending', 'scheduled', 'running', 'completed', 'error');

CREATE TYPE public.data_source_type AS ENUM ('excel', 'database', 'api', 'cloud', 'iot');

CREATE TYPE public.data_source_status AS ENUM ('connected', 'warning', 'error', 'pending');

-- -----------------------------------------------
-- Helper Function: updated_at trigger
-- -----------------------------------------------
-- Automatically sets `updated_at` to now() on UPDATE.
-- Applied to all tables that have an `updated_at` column.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------
-- Helper Function: get_user_org_ids()
-- -----------------------------------------------
-- Returns an array of organization UUIDs the current
-- authenticated user belongs to. Used by all RLS policies
-- to enforce tenant isolation.
--
-- SECURITY DEFINER: runs with the function owner's privileges,
-- allowing it to read organization_members even when RLS is enabled.
-- SET search_path = '': prevents search_path injection attacks.
-- STABLE: result is consistent within a single transaction.

CREATE OR REPLACE FUNCTION public.get_user_org_ids()
RETURNS uuid[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT COALESCE(
    array_agg(om.organization_id),
    '{}'::uuid[]
  )
  FROM public.organization_members om
  WHERE om.user_id = auth.uid()
$$;

-- -----------------------------------------------
-- Helper Function: user_has_org_role()
-- -----------------------------------------------
-- Checks if the current user has one of the specified
-- roles in the given organization. Used for write-level
-- RLS policies (INSERT, UPDATE, DELETE).

CREATE OR REPLACE FUNCTION public.user_has_org_role(
  _org_id uuid,
  _roles public.org_role[]
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = _org_id
      AND om.user_id = auth.uid()
      AND om.role = ANY(_roles)
  )
$$;
