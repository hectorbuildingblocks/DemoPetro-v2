
# Product Requirements Document (PRD) - Digital Twin v1.0
**Fecha**: 11/03/2026  
**TPM**: Senior Technical Project Manager  
**Status**: Aprobado para Sprint 0  

## 1. Información General del Proyecto
- **Nombre**: Digital Twin (DTO - Digital Twin of the Organization)  
- **Fecha Inicio**: 13/01/2026  
- **Responsable**: [TPM Oversight]  
- **Equipo**: Héctor Gil (Full-stack), Antonio Parrilla (React), Jose Varet (Node), Meg Hodgert (Data/IA)  
- **Stakeholders**: Ejecutivo, Operaciones, IT  
- **Descripción**: Plataforma SaaS Node+React que crea gemelo digital dinámico de organización via datos operativos + IA (Claude). Análisis, simulaciones what-if, optimización decisiones.

## 2. Tech Stack (Finalizado)
| Componente | Tecnología | Razón |
|------------|------------|-------|
| Backend | Node.js + NestJS | Microservicios escalables |
| Frontend | React 18 + TS + React Flow | Visualizaciones flujos |
| **Datos** | **Supabase (Postgres + Realtime)** | Persistencia, auth, realtime |
| **IA/LLM** | **Claude API** + rules-based | Recomendaciones precisas |
| Deploy | **Railway** | SaaS 1-click |
| Caching | Redis (opcional post-MVP) | Si latencia >500ms |

## 3. Objetivos (OKRs)
**General**: Plataforma DTO SaaS midiendo 90% uptime, <2s latencia, 20% ineficiencias detectadas.  
**Específicos Priorizados** (Q1-Q4): Arquitectura → Modelado → Análisis → Simulaciones → Recomendaciones.

## 4. Alcance
### Incluye (MVP v1.0 - 8 Sprints)
| ID | Funcionalidad | Story Points | Sprint |
|----|---------------|--------------|--------|
| RF-01 | Ingesta datos (CSV/Excel/Realtime) | 16 | 1-2 |
| RF-07 | Dashboard KPIs | 13 | 1 |
| RF-03 | Visualización flujos | 21 | 2 |
| RF-02 | Motor modelado | 34 | 2-3 |
| RF-08 | Gestión usuarios | 8 | 1 |
| RF-04 | Detección anomalías | 21 | 3 |
| RF-06 | Recomendaciones Claude | 13 | 4 |
| RF-05 | Simulaciones what-if | 34 | 4+ (Spike primero) |

### Excluye v1.0
- ERP integrations
- Mobile app
- Custom ML (solo Claude + rules)
- Sostenibilidad KPIs

## 5. Requisitos Funcionales Detallados

### RF-01: Ingesta Datos
**Desc**: Carga/actualización CSV/Excel/formularios → Supabase.  
**AC**: <5min 10k rows; Supabase Realtime subscriptions.  
**Tech**: `@supabase/supabase-js` + PapaParse.

### RF-02: Motor Modelado
**Desc**: Flujos/tareas/dependencias grafos.  
**AC**: CRUD JSON schemas.  
**Tech**: XState + Supabase pg_graphql.

### RF-03: Visualización
**Desc**: Diagramas interactivos React Flow.  
**AC**: <100ms render 100 nodos.  
**Tech**: React Flow + Recharts.

### RF-04: Detección Ineficiencias
**Desc**: Rules + Claude para bottlenecks.  
**AC**: 80% precisión dataset test.  
**Tech**: Anthropic SDK.

### RF-05: Simulaciones What-If
**Desc**: Modifica variables → predice impacto.  
**AC**: <10s simulación básica.  
**Tech**: Web Workers + Claude reasoning.

### RF-06: Recomendaciones
**Desc**: Acciones optimización justificadas.  
**AC**: 5+ recs por análisis.  
**Tech**: Claude prompts estructurados.

### RF-07: Dashboard KPIs
**Desc**: KPIs dinámicos realtime.  
**AC**: Custom charts Supabase live.  
**Tech**: TanStack Query + Recharts.

### RF-08: Gestión Usuarios
**Desc**: Roles, escenarios históricos.  
**AC**: Supabase RLS + JWT.  
**Tech**: Supabase Auth.

## 6. Requisitos No Funcionales
| Categoría | Requisito | Métrica |
|-----------|-----------|---------|
| Performance | Load times | <2s P95 |
| Seguridad | Multi-tenant | Supabase RLS |
| Escalabilidad | Concurrentes | 100 users |
| CI/CD | Pipeline | GitHub → Railway |
| Monitoreo | SLOs | Railway metrics |

## 7. Roadmap
```

Sprint 0 (11-18 Mar): Spike Supabase+Claude+React Flow (5pts)
Sprint 1 (19-25 Mar): Auth + Ingesta + Dashboard base (20pts)
Sprint 2-4: Core features
MVP v1.0: 15/May/2026

```

## 8. Riesgos y Mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Latencia simulaciones | Alto | Spike Web Workers |
| Datos heterogéneos | Medio | Normalización RF-01 |
| Costo Claude API | Bajo | Rate limits + caching |

## 9. Siguiente Pasos
1. **HOY**: Repo GitHub `digital-twin-dto`
2. **MAÑANA**: Railway project + Supabase link
3. **Viernes**: Sprint 0 kickoff

**Aprobado por**: [Espacio para firmas digitales]
```
