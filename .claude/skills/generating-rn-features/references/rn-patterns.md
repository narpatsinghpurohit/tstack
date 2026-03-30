# React Native Patterns & Conventions

## Feature Directory Structure

```
apps/mobile/src/features/product-list/
├── product-list.hook.ts        # Business logic
├── product-list.view.tsx       # Pure UI (ZERO hooks)
├── product-list.tsx            # Glue
├── index.ts                    # Public API
├── use-products.ts             # TanStack Query hooks
├── _components/
│   └── product-row.tsx         # Sub-component (CAN use hooks)
└── _hooks/
    └── use-product-filters.ts  # Helper hook
```

## Screen Registration with React Navigation

```typescript
// apps/mobile/src/navigation/main.navigator.tsx
import { createStackNavigator } from "@react-navigation/stack";
import { ProductList } from "@/features/product-list";
import { ProductDetail } from "@/features/product-detail";

export type MainStackParamList = {
  ProductList: undefined;
  ProductDetail: { id: string };
};

const Stack = createStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} options={{ title: "Products" }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: "Product" }} />
    </Stack.Navigator>
  );
}
```

## Navigation Typing

```typescript
import type { NavigationProp, RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { MainStackParamList } from "@/navigation/main.navigator";

// In hook file
const navigation = useNavigation<NavigationProp<MainStackParamList>>();
navigation.navigate("ProductDetail", { id: "123" });

// For reading params
const route = useRoute<RouteProp<MainStackParamList, "ProductDetail">>();
const { id } = route.params;
```

## Safe Area Handling

```typescript
import { SafeAreaView } from "react-native-safe-area-context";

// Wrap screen root
export function ProductListView(props: ProductListViewProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* screen content */}
    </SafeAreaView>
  );
}

// Or use hook for fine-grained control
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }}>
```

## Keyboard Handling

```typescript
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";

// Wrap form screens
<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  className="flex-1"
>
  {/* form content */}
</KeyboardAvoidingView>

// Dismiss keyboard on submit
const handleSubmit = () => {
  Keyboard.dismiss();
  // ... submit logic
};
```

## List Performance

```typescript
import { FlatList } from "react-native";
import { memo } from "react";

// Extract renderItem to a memoized component
const ProductRow = memo(function ProductRow({ item }: { item: ProductResponse }) {
  return (
    <View className="flex-row items-center p-4 border-b border-border">
      <Text className="text-foreground">{item.name}</Text>
    </View>
  );
});

// In view (not hook — views can reference sub-components)
<FlatList
  data={products}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => <ProductRow item={item} />}
  getItemLayout={(_, index) => ({ length: 64, offset: 64 * index, index })}
  ListEmptyComponent={<EmptyState message="No products" />}
/>
```

## Deep Linking

```typescript
// apps/mobile/src/navigation/linking.ts
const linking = {
  prefixes: ["myapp://", "https://myapp.com"],
  config: {
    screens: {
      ProductList: "products",
      ProductDetail: "products/:id",
    },
  },
};

// In App.tsx
<NavigationContainer linking={linking}>
```

## Shared Code with Web

These can be shared between `apps/web` and `apps/mobile`:
- **Zod schemas** — from the shared package
- **TanStack Query hooks** — same API client, same query key factories
- **Zustand stores** — pure state logic, no UI
- **Types** — from the shared package
- **Constants** — permissions, enums

These are app-specific:
- **Components** — React Native vs React DOM
- **Routing** — React Navigation vs TanStack Router
- **Styling** — NativeWind className vs Tailwind className (similar but not identical)
- **Testing** — RNTL vs RTL
