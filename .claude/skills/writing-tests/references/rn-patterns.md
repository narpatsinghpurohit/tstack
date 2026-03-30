# React Native Test Patterns

## Test Wrapper Utility

```typescript
// apps/mobile/src/test/test-utils.tsx
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react-native";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>{ui}</NavigationContainer>
    </QueryClientProvider>,
    options,
  );
}

export { screen, waitFor, within, fireEvent } from "@testing-library/react-native";
```

## MSW Setup

MSW works in React Native's Jest environment using `msw/node` (same as web).

```typescript
// apps/mobile/src/test/msw-server.ts
import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Screen Test with Navigation Params

```typescript
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function renderWithParams(params: { id: string }) {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Detail" component={ProductDetail} initialParams={params} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>,
  );
}

it("loads product by route param", async () => {
  server.use(http.get(apiUrl("/v1/products/product-1"), () => jsonSuccess({ _id: "product-1", name: "Widget" })));
  renderWithParams({ id: "product-1" });
  expect(await screen.findByText("Widget")).toBeTruthy();
});
```

## Accessibility Assertions

```typescript
// Query by accessibility label
expect(screen.getByLabelText("Add product")).toBeTruthy();

// Query by role
expect(screen.getByRole("button", { name: "Add product" })).toBeTruthy();
```

## Navigation Assertions

```typescript
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

it("navigates to detail on press", async () => {
  renderWithProviders(<ProductList />);
  fireEvent.press(await screen.findByLabelText("View Widget A"));
  expect(mockNavigate).toHaveBeenCalledWith("ProductDetail", { id: "product-1" });
});
```

## Common Pitfalls

1. **Missing NavigationContainer** — components using `useNavigation` or `useRoute` crash without it
2. **Using `@testing-library/react` instead of `@testing-library/react-native`** — similar APIs but not identical. RN uses `fireEvent.press` not `userEvent.click`
3. **Forgetting `waitFor` with async data** — use `findBy*` queries or `waitFor` for data-fetching components
4. **Not resetting mocks** — use `beforeEach(() => jest.clearAllMocks())`
5. **Testing implementation details** — test what the user sees and interacts with, not internal state
