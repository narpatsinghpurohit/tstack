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

## Mobile-Specific

## MOB-1: FlatList/FlashList for lists
Never `.map()` inside ScrollView. FlatList provides virtualization.

## MOB-2: NativeWind className for styling
Use `className` prop. StyleSheet only for complex animations or platform edge cases.

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
Every Pressable/TouchableOpacity needs `accessibilityLabel` + `accessibilityRole`.

## Performance

## PERF-1: React.memo for FlatList renderItem
Extract renderItem to a named component wrapped in `React.memo`.

## PERF-2: Image caching required
Use `react-native-fast-image` or `expo-image` for network images. Never plain `Image` for remote URLs.

## PERF-3: No large inline objects in JSX
Extract style/config objects outside the component. Inline objects cause re-renders every render cycle.
