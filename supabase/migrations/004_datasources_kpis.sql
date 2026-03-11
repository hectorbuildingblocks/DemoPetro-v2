-- ============================================
-- Migration 004: Data Sources + KPIs
-- ============================================
-- Data sources connect external data to projects.
-- KPIs are a superset table covering all 3 shapes
-- found in frontend components (ADR-007).

-- -----------------------------------------------
-- Table: data_sources
-- -----------------------------------------------
-- project_id is nullable: a data source can be org-level
-- (not tied to a specific project). ON DELETE SET NULL
-- preserves the data source if the project is removed.

CREATE TABLE public.data_sources (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id        uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  name              text NOT NULL,
  type              public.data_source_type NOT NULL DEFAULT 'excel',
  status            public.data_source_status NOT NULL DEFAULT 'pending',
  last_sync         timestamptz,
  records_count     integer NOT NULL DEFAULT 0,
  size              text,
  description       text,
  schema_config     jsonb DEFAULT '[]'::jsonb,
  connection_config jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_data_sources_org ON public.data_sources (organization_id);
CREATE INDEX idx_data_sources_project ON public.data_sources (project_id);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.data_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------
-- Table: kpis
-- -----------------------------------------------
-- Superset of all KPI shapes (ADR-007):
--   Dashboard: name, value, unit, trend, color
--   KPIManager: target, current_value, type, formula, linked_node_key, frequency
--   Display: display_value, icon
--
-- project_id is nullable: KPIs can be org-level.

CREATE TABLE public.kpis (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id        uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  name              text NOT NULL,
  description       text,
  type              text DEFAULT 'percentage',
  value             numeric(15,4),
  unit              text,
  target            numeric(15,4),
  current_value     numeric(15,4),
  change_pct        numeric(5,2),
  trend             text CHECK (trend IN ('up', 'down', 'stable')),
  color             text DEFAULT '#3b82f6',
  frequency         text DEFAULT 'daily',
  formula           text,
  linked_node_key   text,
  linked_metric     text,
  icon              text DEFAULT 'target',
  display_value     text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_kpis_org ON public.kpis (organization_id);
CREATE INDEX idx_kpis_project ON public.kpis (project_id);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.kpis
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
