# TanStack Query Patterns

## Query key factory

```typescript
const queryKeys = {
  all: ['examples'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: Filters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};
```

## Paginated queries

```typescript
export function useExamplesPaginated(page: number, limit: number) {
  return useQuery({
    queryKey: [...KEYS.all, { page, limit }],
    queryFn: () => api.get('/examples', { params: { page, limit } }).then((r) => r.data.data),
    placeholderData: keepPreviousData,
  });
}
```

## Optimistic updates

```typescript
export function useUpdateExample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExampleDto }) =>
      api.put(`/examples/${id}`, dto),
    onMutate: async ({ id, dto }) => {
      await qc.cancelQueries({ queryKey: KEYS.byId(id) });
      const previous = qc.getQueryData(KEYS.byId(id));
      qc.setQueryData(KEYS.byId(id), (old: any) => ({ ...old, ...dto }));
      return { previous };
    },
    onError: (_err, { id }, context) => {
      qc.setQueryData(KEYS.byId(id), context?.previous);
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: KEYS.byId(id) });
    },
  });
}
```

## Prefetching on hover

```typescript
function ExampleLink({ id }: { id: string }) {
  const qc = useQueryClient();
  const prefetch = () => {
    qc.prefetchQuery({
      queryKey: KEYS.byId(id),
      queryFn: () => api.get(`/examples/${id}`).then((r) => r.data.data),
      staleTime: 30_000,
    });
  };

  return (
    <Link to="/examples/$id" params={{ id }} onMouseEnter={prefetch}>
      View
    </Link>
  );
}
```

## Error retry configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```
