# Query Key Factory Pattern

Every resource should define a key factory object. This enables:
- Hierarchical cache invalidation (`courseKeys.all` invalidates everything)
- Targeted invalidation (`courseKeys.detail(id)` invalidates one item)
- Consistent key structure across the codebase

## Template

```typescript
export const resourceKeys = {
  all: ["resources"] as const,
  lists: () => [...resourceKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) => [...resourceKeys.lists(), params] as const,
  details: () => [...resourceKeys.all, "detail"] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
};
```

## Usage in hooks

```typescript
// List query — uses lists() key
export function useResources() {
  return useQuery({
    queryKey: resourceKeys.lists(),
    queryFn: () => apiClient.get("/resources").then((r) => r.data),
  });
}

// Detail query — uses detail(id) key
export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => apiClient.get(`/resources/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

// Mutation — invalidates lists() to refresh list views
export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateResourceDto) => apiClient.post("/resources", dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: resourceKeys.lists() }),
  });
}
```

## With pagination params

```typescript
export function useResources(params: { page: number; limit: number; search?: string }) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: () => apiClient.get("/resources", { params }).then((r) => r.data),
  });
}
```
