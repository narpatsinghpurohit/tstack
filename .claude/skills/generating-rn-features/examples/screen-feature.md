> *This is a generic template. Replace `Product` with your entity and `@your-org/shared` with your shared package.*

# Generic Screen Feature (Product List)

## Hook — `product-list.hook.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCan } from "@/hooks/use-can";
import { apiClient } from "@/lib/api-client";
import type { ProductResponse } from "@your-org/shared";

const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
};

export type ProductListViewProps = ReturnType<typeof useProductList>;

export function useProductList() {
  const queryClient = useQueryClient();
  const { can } = useCan();

  const { data, isLoading } = useQuery({
    queryKey: productKeys.list(),
    queryFn: () => apiClient.get<{ data: ProductResponse[] }>("/v1/products").then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/v1/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });

  return {
    products: data ?? [],
    isLoading,
    canDelete: can("products:delete"),
    onDelete: (id: string) => deleteMutation.mutate(id),
  };
}
```

## View — `product-list.view.tsx`

```tsx
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ProductListViewProps } from "./product-list.hook";

export function ProductListView({ products, isLoading, canDelete, onDelete }: ProductListViewProps) {
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <View className="flex-1">
              <Text className="text-lg font-medium text-foreground">{item.name}</Text>
              <Text className="text-sm text-muted-foreground">{item.description}</Text>
            </View>
            {canDelete ? (
              <Pressable
                onPress={() => onDelete(item._id)}
                accessibilityLabel={`Delete ${item.name}`}
                accessibilityRole="button"
                className="px-3 py-2"
              >
                <Text className="text-destructive">Delete</Text>
              </Pressable>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-muted-foreground">No products yet</Text>
          </View>
        }
      />
    </SafeAreaView>
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

## Navigation Registration

```tsx
// In apps/mobile/src/navigation/main.navigator.tsx
import { ProductList } from "@/features/product-list";

<Stack.Screen name="ProductList" component={ProductList} options={{ title: "Products" }} />
```

## Key patterns

1. **3-file split** — identical to web: hook + view + glue
2. **View = ZERO hooks** — pure RN components, props only
3. **FlatList** — virtualized list, not ScrollView + .map()
4. **SafeAreaView** — wraps screen root
5. **NativeWind className** — semantic colors, consistent with web Tailwind
6. **accessibilityLabel** — on every interactive Pressable
7. **Ternary** for conditional rendering — not `&&`
8. **Query key factory** — same pattern as web
