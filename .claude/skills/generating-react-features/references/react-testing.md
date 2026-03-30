# React Testing Patterns

## Test wrapper with providers

```typescript
// apps/web/src/test/test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';

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
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    options,
  );
}
```

## Component test with mocked API

```typescript
import { renderWithProviders } from '@/test/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw-server';
import { ItemList } from '../components/item-list';

describe('ItemList', () => {
  it('renders items from API', async () => {
    server.use(
      http.get('/api/v1/items', () =>
        HttpResponse.json({
          data: [{ _id: '1', title: 'Test Item' }],
          status: 200,
          message: 'OK',
        }),
      ),
    );

    renderWithProviders(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });

  it('shows error state', async () => {
    server.use(
      http.get('/api/v1/items', () => HttpResponse.error()),
    );

    renderWithProviders(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## MSW server setup

```typescript
// apps/web/src/test/msw-server.ts
import { setupServer } from 'msw/node';

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Zustand store testing

```typescript
import { useItemStore } from '@/stores/use-item-store';

beforeEach(() => useItemStore.setState({ selectedIds: new Set() }));

it('toggles selection', () => {
  const { toggleSelection } = useItemStore.getState();
  toggleSelection('1');
  expect(useItemStore.getState().selectedIds.has('1')).toBe(true);
  toggleSelection('1');
  expect(useItemStore.getState().selectedIds.has('1')).toBe(false);
});
```
