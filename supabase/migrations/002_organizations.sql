-- ============================================
-- Migration 002: Organizations + Members
-- ============================================
-- Multi-tenant foundation. Every other table references
-- organizations for tenant isolation.

-- -----------------------------------------------
-- Table: organizations
-- -----------------------------------------------

CREATE TABLE public.organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  logo_url    text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_organizations_slug ON public.organizations (slug);

-- Apply updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------
-- Table: organization_members
-- -----------------------------------------------
-- Links auth.users to organizations with a role.
-- A user can belong to multiple organizations.
-- Each (organization_id, user_id) pair is unique.

CREATE TABLE public.organization_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role              public.org_role NOT NULL DEFAULT 'member',
  created_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_user ON public.organization_members (user_id);
CREATE INDEX idx_org_members_org ON public.organization_members (organization_id);
