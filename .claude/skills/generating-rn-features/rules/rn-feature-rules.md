# React Native Feature Rules (Non-Negotiable)

## 3-File Split (same as web)

## FEAT-R1: View files contain ZERO hooks
No `useState`, `useEffect`, `useQuery`, `useCan`, `useNavigation`, `useForm`, `useMemo`, `useCallback`. Nothing from React hooks. Pure props in, JSX out.

## FEAT-R2: Hook return type === View props type
The hook must return exactly the type the view accepts. Single TypeScript type, defined in the hook file, imported by the view.

## FEAT-R3: Glue file is a one-liner
```tsx
export function ProductList() {
  return <ProductListView {...useProductList()} />;
}
```

## FEAT-R4: Features are flat directories
`features/product-list/`, NOT `features/admin/product/`. Use domain prefix to group: `product-list/`, `product-detail/`, `product-editor/`.

## FEAT-R5: No cross-feature imports
`features/X` cannot import from `features/Y`.

## FEAT-R6: index.ts exports only the glue component
```ts
export { ProductList } from './product-list';
```

## FEAT-R7: API hooks start feature-local
Place in the feature directory. Promote to `shared/api/queries/` only when a second consumer appears.

## FEAT-R8: Import boundaries
```
navigation/ → features/ → shared/ → components/
```

## React Native Specific

## MOB-1: FlatList/FlashList for lists
Never use `.map()` inside ScrollView for dynamic lists. FlatList provides virtualization for performance.
```tsx
// BAD
<ScrollView>{items.map(item => <Item key={item._id} />)}</ScrollView>

// GOOD
<FlatList data={items} keyExtractor={(item) => item._id} renderItem={({ item }) => <Item item={item} />} />
```

## MOB-2: NativeWind className for styling
Use NativeWind `className` prop. Only use `StyleSheet.create` for complex animations or platform-specific edge cases.
```tsx
// BAD
<View style={{ padding: 16, backgroundColor: 'white' }}>

// GOOD
<View className="p-4 bg-background">
```

## MOB-3: No web-only APIs
No `localStorage`, `window`, `document`, DOM manipulation, CSS media queries. Use `AsyncStorage`, `Dimensions`, `Platform` instead.

## MOB-4: Platform-specific code
Use `Platform.select()` or `.ios.tsx` / `.android.tsx` file suffixes for platform-specific behavior.
```tsx
import { Platform } from "react-native";
const behavior = Platform.select({ ios: "padding", android: "height" });
```

## MOB-5: KeyboardAvoidingView for form screens
All screens with text inputs must wrap content in `KeyboardAvoidingView`.
```tsx
<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
  {/* form content */}
</KeyboardAvoidingView>
```

## MOB-6: SafeAreaView on every screen root
No hardcoded status bar padding. Use `SafeAreaView` or `useSafeAreaInsets`.

## MOB-7: Typed navigation params
Define `RootStackParamList` type and use typed hooks.
```typescript
type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { id: string };
};

const navigation = useNavigation<NavigationProp<RootStackParamList>>();
```

## MOB-8: No hardcoded pixel dimensions
Use `Dimensions` API, percentage-based sizing, or `flex`. No `width: 375`.

## MOB-9: Accessibility on interactive elements
Every `Pressable`, `Button`, or interactive element must have `accessibilityLabel` and `accessibilityRole`.
```tsx
<Button accessibilityLabel="Delete product" onPress={onDelete}>
  <Text>Delete</Text>
</Button>
```

## React Native Reusables (UI Components)

## UI-1: Use React Native Reusables components
All UI primitives must come from `@/components/ui/`. Never build manual Button, Input, Card, Dialog, etc.
```bash
# Add missing components
bunx --bun @react-native-reusables/cli@latest add button input card text
```

## UI-2: Text component required
All text must use `<Text>` from `@/components/ui/text`. RN does not support bare strings.
```tsx
// BAD — crashes on RN
<View>Hello</View>

// GOOD
import { Text } from "@/components/ui/text";
<View><Text>Hello</Text></View>
```

## UI-3: Button requires Text child
RN Button does not accept string children.
```tsx
// BAD
<Button>Submit</Button>

// GOOD
<Button><Text>Submit</Text></Button>
```

## UI-4: PortalHost for overlays
Dialog, DropdownMenu, Select, Tooltip, Popover need `PortalHost` in root layout.

## UI-5: Label uses nativeID (not htmlFor)
```tsx
<Label nativeID="email">Email</Label>
<Input aria-labelledby="email" />
```

## UI-6: NativeWind theme tokens
Use semantic tokens from shadcn theme. Never hardcode colors.
```tsx
// BAD
<View style={{ backgroundColor: '#fff' }}>

// GOOD
<View className="bg-background">
```
