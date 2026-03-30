> *This is a generic template. Replace `Product` with your entity.*

# Example: React Native Screen Test

## ProductList test — `product-list.test.tsx`

```typescript
import { type ProductResponse, PERMISSIONS } from "@your-org/shared";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { http } from "msw";
import { apiUrl, jsonSuccess } from "@/test/http";
import { server } from "@/test/msw-server";
import { renderWithProviders, screen } from "@/test/test-utils";
import { ProductList } from "./product-list";

const mocks = {
  navigate: jest.fn(),
  useCan: jest.fn(),
};

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return { ...actual, useNavigation: () => ({ navigate: mocks.navigate }) };
});

jest.mock("@/hooks/use-can", () => ({
  useCan: mocks.useCan,
}));

const product: ProductResponse = {
  _id: "product-1",
  orgId: "org-1",
  name: "Widget A",
  description: "A useful widget",
  price: 29.99,
  isActive: true,
  createdAt: "2026-03-01T10:00:00.000Z",
  updatedAt: "2026-03-02T10:00:00.000Z",
};

function setPermissions(permissions: string[]) {
  mocks.useCan.mockReturnValue({
    can: (permission: string) => permissions.includes(permission),
  });
}

function installHandlers(products: ProductResponse[] = [product]) {
  server.use(
    http.get(apiUrl("/v1/products"), () => jsonSuccess(products)),
    http.delete(apiUrl("/v1/products/:id"), () => jsonSuccess(product)),
  );
}

describe("ProductList", () => {
  beforeEach(() => {
    setPermissions([PERMISSIONS.PRODUCTS_VIEW, PERMISSIONS.PRODUCTS_DELETE]);
    installHandlers();
    jest.clearAllMocks();
  });

  it("renders product list", async () => {
    renderWithProviders(<ProductList />);

    expect(await screen.findByText("Widget A")).toBeTruthy();
    expect(screen.getByText("A useful widget")).toBeTruthy();
  });

  it("hides delete when user lacks permission", async () => {
    setPermissions([PERMISSIONS.PRODUCTS_VIEW]);

    renderWithProviders(<ProductList />);

    expect(await screen.findByText("Widget A")).toBeTruthy();
    expect(screen.queryByLabelText("Delete Widget A")).toBeNull();
  });

  it("shows delete when user has permission", async () => {
    renderWithProviders(<ProductList />);

    expect(await screen.findByLabelText("Delete Widget A")).toBeTruthy();
  });

  it("shows empty state when no products", async () => {
    installHandlers([]);

    renderWithProviders(<ProductList />);

    expect(await screen.findByText("No products yet")).toBeTruthy();
  });

  it("deletes product on press", async () => {
    let deletedId: string | null = null;
    server.use(
      http.delete(apiUrl("/v1/products/:id"), ({ params }) => {
        deletedId = String(params.id);
        return jsonSuccess(product);
      }),
    );

    renderWithProviders(<ProductList />);

    fireEvent.press(await screen.findByLabelText("Delete Widget A"));

    await waitFor(() => {
      expect(deletedId).toBe("product-1");
    });
  });
});
```

## Key patterns

1. **Jest** (not Vitest) for React Native tests
2. **`@testing-library/react-native`** — `fireEvent.press`, `screen.findByText`, `screen.queryByLabelText`
3. **MSW for API mocking** — same `server.use(http.get(...))` pattern as web
4. **`renderWithProviders`** — wraps in QueryClientProvider + NavigationContainer
5. **Permission testing** — `setPermissions()` helper, same pattern as web
6. **`accessibilityLabel` queries** — `findByLabelText`, `queryByLabelText` for buttons
7. **`jest.clearAllMocks()`** in `beforeEach`
8. **`waitFor`** for async assertions after mutations
