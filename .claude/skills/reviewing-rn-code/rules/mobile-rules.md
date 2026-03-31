# React Native Mobile Rules (Non-Negotiable)

## 3-File Split (universal — same as web)

## FEAT-R1: View files contain ZERO hooks
## FEAT-R2: Hook return type === View props type
## FEAT-R3: Glue file is a one-liner
## FEAT-R4: Features are flat directories
## FEAT-R5: No cross-feature imports
## FEAT-R6: index.ts exports only the glue component
## FEAT-R7: API hooks start feature-local
## FEAT-R8: Import boundaries (`navigation/ → features/ → shared/ → components/`)

See `generating-rn-features/rules/rn-feature-rules.md` for detailed descriptions of FEAT-R1 through R8.

## React Native Reusables (UI Components)

## UI-1: Use React Native Reusables components
All UI primitives must come from `@/components/ui/`. Never build manual Button, Input, Card, Dialog, etc.
```bash
# Add missing components
bunx --bun @react-native-reusables/cli@latest add button input card dialog
```

## UI-2: Text component required
All text must use `<Text>` from `@/components/ui/text`. React Native does not support bare strings.
```tsx
// BAD
<View>Hello</View>

// GOOD
import { Text } from "@/components/ui/text";
<View><Text>Hello</Text></View>
```

## UI-3: Button requires Text child
RN Button does not accept string children directly.
```tsx
// BAD
<Button>Submit</Button>

// GOOD
<Button><Text>Submit</Text></Button>
```

## UI-4: PortalHost required for overlay components
Dialog, DropdownMenu, Select, Tooltip, Popover need `PortalHost` in root layout.

## UI-5: Label uses nativeID
```tsx
// BAD (web pattern)
<Label htmlFor="email">Email</Label>

// GOOD (RN pattern)
<Label nativeID="email">Email</Label>
<Input aria-labelledby="email" />
```

## UI-6: Theme tokens from NativeWind
Use semantic tokens, never hardcoded colors.
```tsx
// BAD
<View style={{ backgroundColor: '#ffffff' }}>

// GOOD
<View className="bg-background">
```

## Mobile-Specific

## MOB-1: FlatList/FlashList for lists
Never `.map()` inside ScrollView. FlatList provides virtualization.

## MOB-2: NativeWind className for styling
Use `className` prop. StyleSheet only for complex Reanimated animations.

## MOB-3: No web-only APIs
No `localStorage`, `window`, `document`, DOM, CSS media queries.

## MOB-4: Platform-specific code via proper pattern
Use `Platform.select()` or `.ios.tsx`/`.android.tsx` file suffixes.

## MOB-5: KeyboardAvoidingView for form screens
All screens with text inputs must use it.

## MOB-6: SafeAreaView on every screen root
No hardcoded status bar padding.

## MOB-7: Typed navigation params
Define param list type. Use `useNavigation<NavigationProp<...>>()`.

## MOB-8: No hardcoded pixel dimensions
Use flex, percentage, or Dimensions API.

## MOB-9: Accessibility on interactive elements
Every Pressable/Button needs `accessibilityLabel` + `accessibilityRole`.

## Performance

## PERF-1: React.memo for FlatList renderItem
Extract renderItem to a named component wrapped in `React.memo`.

## PERF-2: Image caching required
Use `react-native-fast-image` or `expo-image` for network images. Never plain `Image` for remote URLs.

## PERF-3: No large inline objects in JSX
Extract style/config objects outside the component. Inline objects cause re-renders every render cycle.

## PERF-4: Reanimated for animations
Use `react-native-reanimated` for native-quality animations. Never `Animated` API from RN core.
