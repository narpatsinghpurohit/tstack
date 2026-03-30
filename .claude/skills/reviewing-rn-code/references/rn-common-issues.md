# Common React Native Review Issues

## 1. ScrollView + .map() for long lists

**Bad:**
```tsx
<ScrollView>
  {items.map(item => <ProductRow key={item._id} item={item} />)}
</ScrollView>
```

**Good:**
```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => <ProductRow item={item} />}
/>
```

## 2. Memory leaks from unsubscribed listeners

**Bad:**
```tsx
useEffect(() => {
  AppState.addEventListener("change", handleChange);
  Keyboard.addListener("keyboardDidShow", handleShow);
}, []);
```

**Good:**
```tsx
useEffect(() => {
  const sub1 = AppState.addEventListener("change", handleChange);
  const sub2 = Keyboard.addListener("keyboardDidShow", handleShow);
  return () => { sub1.remove(); sub2.remove(); };
}, []);
```

## 3. Missing keyboard dismiss on form submit

**Bad:**
```tsx
const onSubmit = (data) => {
  mutation.mutate(data);
};
```

**Good:**
```tsx
const onSubmit = (data) => {
  Keyboard.dismiss();
  mutation.mutate(data);
};
```

## 4. Large images without caching

**Bad:**
```tsx
import { Image } from "react-native";
<Image source={{ uri: "https://cdn.example.com/large.jpg" }} />
```

**Good:**
```tsx
import FastImage from "react-native-fast-image";
<FastImage source={{ uri: "https://cdn.example.com/large.jpg", priority: FastImage.priority.normal }} />
```

## 5. Hardcoded pixel dimensions

**Bad:**
```tsx
<View style={{ width: 375, height: 50 }}>
```

**Good:**
```tsx
<View className="w-full h-12">
// or
<View style={{ width: "100%", height: 50 }}>
```

## 6. Missing accessibility props

**Bad:**
```tsx
<Pressable onPress={handleDelete}>
  <Text>Delete</Text>
</Pressable>
```

**Good:**
```tsx
<Pressable onPress={handleDelete} accessibilityLabel="Delete product" accessibilityRole="button">
  <Text>Delete</Text>
</Pressable>
```

## 7. useEffect instead of useFocusEffect

**Bad:**
```tsx
// Runs once on mount — stale data when navigating back
useEffect(() => {
  refetch();
}, []);
```

**Good:**
```tsx
import { useFocusEffect } from "@react-navigation/native";

// Runs every time screen gains focus
useFocusEffect(useCallback(() => {
  refetch();
}, [refetch]));
```

## 8. Missing SafeAreaView

**Bad:**
```tsx
export function ProductListView(props) {
  return <View className="flex-1">{/* content hidden behind notch */}</View>;
}
```

**Good:**
```tsx
import { SafeAreaView } from "react-native-safe-area-context";

export function ProductListView(props) {
  return <SafeAreaView className="flex-1 bg-background">{/* safe */}</SafeAreaView>;
}
```

## 9. Missing KeyboardAvoidingView

**Bad:**
```tsx
export function ProductFormView(props) {
  return <View className="flex-1">{/* inputs hidden behind keyboard */}</View>;
}
```

**Good:**
```tsx
<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
  {/* inputs stay visible */}
</KeyboardAvoidingView>
```

## 10. Inline object in FlatList renderItem

**Bad:**
```tsx
<FlatList
  renderItem={({ item }) => <View style={{ padding: 16 }}><Text>{item.name}</Text></View>}
/>
```

**Good:**
```tsx
const ProductRow = memo(({ item }: { item: ProductResponse }) => (
  <View className="p-4"><Text>{item.name}</Text></View>
));

<FlatList renderItem={({ item }) => <ProductRow item={item} />} />
```
