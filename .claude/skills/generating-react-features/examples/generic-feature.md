> *This is a generic template. Replace `Product` with your entity and `@your-org/shared` with your shared package.*

# Generic React Feature Template (Product List)

## Hook — `product-list.hook.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCan } from "@/features/auth/hooks/use-can";
import { apiClient } from "@/lib/api-client";
import type { ProductResponse } from "@your-org/shared";

const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export type ProductListViewProps = ReturnType<typeof useProductList>;

export function useProductList() {
  const queryClient = useQueryClient();
  const { can } = useCan();

  const { data, isLoading } = useQuery({
    queryKey: productKeys.list(),
    queryFn: () =>
      apiClient.get<{ data: ProductResponse[] }>("/v1/products").then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/v1/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });

  return {
    products: data ?? [],
    isLoading,
    canCreate: can("products.create"),
    canDelete: can("products.delete"),
    onDelete: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
  };
}
```

## View — `product-list.view.tsx`

```tsx
// ZERO hooks in this file — props only
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductListViewProps } from "./product-list.hook";

export function ProductListView({
  products,
  isLoading,
  canCreate,
  canDelete,
  onDelete,
}: ProductListViewProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        {canCreate ? <Button>Add Product</Button> : null}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No products yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              {canDelete ? <TableHead /> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.isActive ? "Active" : "Inactive"}</TableCell>
                {canDelete ? (
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(product._id)}>
                      Delete
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

## Glue — `product-list.tsx`

```tsx
import { useProductList } from "./product-list.hook";
import { ProductListView } from "./product-list.view";

export function ProductList() {
  return <ProductListView {...useProductList()} />;
}
```

## Index — `index.ts`

```typescript
export { ProductList } from "./product-list";
```

## Key patterns

1. **Query key factory** — `productKeys.all`, `.list()`, `.detail(id)` for precise cache invalidation
2. **View = ZERO hooks** — only receives props, returns JSX
3. **Hook return type = View props type** — `ProductListViewProps = ReturnType<typeof useProductList>`
4. **Glue = one-liner** — `<ProductListView {...useProductList()} />`
5. **Permission gating** — `canCreate`, `canDelete` as boolean props, ternary in view
6. **Response envelope** — `r.data.data` to unwrap backend response
