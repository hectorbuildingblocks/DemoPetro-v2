-- ============================================
-- Migration 003: Projects + Workflows
-- ============================================
-- Core domain tables for the Digital Twin platform.
-- Projects belong to an organization. Workflows belong
-- to a project. Nodes and connections belong to a workflow.

-- -----------------------------------------------
-- Table: projects
-- -----------------------------------------------

CREATE TABLE public.projects (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name                text NOT NULL,
  operation_type      public.operation_type NOT NULL DEFAULT 'manufacturing',
  status              public.project_status NOT NULL DEFAULT 'planning',
  budget              numeric(15,2),
  completion          smallint NOT NULL DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
  team_size           integer NOT NULL DEFAULT 0,
  location            text,
  risk_level          public.risk_level NOT NULL DEFAULT 'medium',
  next_milestone      text,
  next_milestone_date date,
  real_time_updates   boolean NOT NULL DEFAULT false,
  data_config         jsonb,
  created_by          uuid REFERENCES auth.users(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_org ON public.projects (organization_id);
CREATE INDEX idx_projects_status ON public.projects (organization_id, status);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------
-- Table: workflows
-- -----------------------------------------------
-- Each project can have one or more workflows.
-- organization_id is denormalized for RLS efficiency.

CREATE TABLE public.workflows (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  organization_id     uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name                text NOT NULL,
  description         text,
  total_duration      text,
  estimated_cost      text,
  risk_score          numeric(3,1) CHECK (risk_score >= 0 AND risk_score <= 10),
  ai_recommendations  jsonb DEFAULT '[]'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflows_project ON public.workflows (project_id);
CREATE INDEX idx_workflows_org ON public.workflows (organization_id);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------
-- Table: workflow_nodes
-- -----------------------------------------------
-- Individual steps/nodes within a workflow.
-- node_key is a human-readable identifier unique per workflow.

CREATE TABLE public.workflow_nodes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id       uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  organization_id   uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  node_key          text NOT NULL,
  name              text NOT NULL,
  type              text NOT NULL,
  status            public.node_status NOT NULL DEFAULT 'pending',
  duration          text,
  cost              text,
  progress          smallint NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  position_x        integer NOT NULL DEFAULT 0,
  position_y        integer NOT NULL DEFAULT 0,
  kpis              jsonb DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (workflow_id, node_key)
);

CREATE INDEX idx_workflow_nodes_workflow ON public.workflow_nodes (workflow_id);

-- -----------------------------------------------
-- Table: workflow_connections
-- -----------------------------------------------
-- Edges between workflow nodes.

CREATE TABLE public.workflow_connections (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id       uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  organization_id   uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  from_node_key     text NOT NULL,
  to_node_key       text NOT NULL,
  duration          text,
  progress          smallint NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (workflow_id, from_node_key, to_node_key)
);

CREATE INDEX idx_workflow_connections_workflow ON public.workflow_connections (workflow_id);
