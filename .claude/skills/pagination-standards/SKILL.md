---
name: pagination-standards
description: Defines the pagination standard across shared types, NestJS endpoints, TanStack Query hooks, and React/RN table UIs. Use when adding pagination, paginated list endpoints, page/limit query params, table paging controls, or when reviewing whether pagination follows project conventions.
user-invocable: false
---

# Pagination Standards

## Standard Contract

```ts
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
```

Source of truth: `packages/shared/src/types/index.ts`

## Backend Standard

1. Accept `page` and `limit` as query params in the controller.
2. Default in service: `page = 1`, `limit = 20`
3. Return `PaginatedResponse<T>`.
4. Put pagination query logic in the repository, not the controller.

## Frontend Standard

1. Use TanStack Query with a params object.
2. Include params in the query key.
3. Use component-local pagination state by default.
4. Render `data.items`, not the whole response.
5. Show page controls only when `totalPages > 1`.
6. Reset `page` to `1` when filters change.

## Query Hook Pattern

```ts
interface ListParams { page?: number; limit?: number; search?: string; }

const resourceKeys = {
  all: ["resources"] as const,
  list: (params: ListParams) => [...resourceKeys.all, "list", params] as const,
};
```

## Do Not

- Invent a new paginated response shape.
- Store server pagination state in Zustand.
- Add router search-param sync unless explicitly needed.
