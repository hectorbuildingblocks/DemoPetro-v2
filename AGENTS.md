# Code Review Rules

## TypeScript
- Use const/let, never var
- Prefer interfaces over types for object shapes
- No `any` types — use `unknown` or proper generics
- Strict null checks enabled

## React
- Functional components only
- Named exports for components, default export only for pages
- Custom hooks must start with `use` and return typed objects
- useCallback/useMemo for expensive computations and stable references

## Supabase
- All queries must be scoped by organization_id (multi-tenant)
- RLS policies on every table — no exceptions
- Use typed client: `createClient<Database>()`
- Snake_case in DB, camelCase in TypeScript — mappers handle conversion

## Styling
- Tailwind v4 utility classes only
- No CSS modules, no styled-components, no inline style objects
- Responsive-first: mobile breakpoints before desktop

## File Structure
- Features: `src/features/{feature}/` with barrel index.ts
- Shared hooks: `src/shared/hooks/`
- Shared components: `src/shared/components/`
- Types: `src/shared/types/`

## Testing
- Integration tests over unit tests for hooks
- Test user-visible behavior, not implementation details
