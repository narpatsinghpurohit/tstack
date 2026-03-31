> *Replace `Product` with your entity and the shared package import with your project's from CLAUDE.md.*

# Generic Screen Feature (Product List) — React Native Reusables

## Prerequisites

Ensure UI components are installed:
```bash
cd apps/mobile
bunx --bun @react-native-reusables/cli@latest add button card badge text separator
```

## Hook — `product-list.hook.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCan } from "@/hooks/use-can";
import { apiClient } from "@/lib/api-client";
import type { ProductResponse } from "@tstack/shared";

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
    canDelete: can("products.delete"),
    onDelete: (id: string) => deleteMutation.mutate(id),
  };
}
```

## View — `product-list.view.tsx`

```tsx
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
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
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) => (
          <Card className="mx-4 my-2">
            <CardContent className="flex-row items-center justify-between p-4">
              <View className="flex-1">
                <Text className="text-lg font-medium">{item.name}</Text>
                <Text className="text-sm text-muted-foreground">{item.description}</Text>
              </View>
              {canDelete ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onPress={() => onDelete(item._id)}
                  accessibilityLabel={`Delete ${item.name}`}
                >
                  <Text>Delete</Text>
                </Button>
              ) : null}
            </CardContent>
          </Card>
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

1. **3-file split** — hook + view + glue (identical to web)
2. **View = ZERO hooks** — pure RN components, props only
3. **React Native Reusables** — `Button`, `Card`, `Text`, `Badge` from `@/components/ui/`
4. **Text component** — always use `<Text>` from reusables, never bare strings
5. **Button needs Text child** — `<Button><Text>Label</Text></Button>`
6. **FlatList** — virtualized list, not ScrollView + .map()
7. **SafeAreaView** — wraps screen root
8. **NativeWind className** — semantic theme tokens consistent with web
9. **accessibilityLabel** — on every interactive element
10. **Ternary** for conditional rendering — not `&&`
11. **Query key factory** — same pattern as web
