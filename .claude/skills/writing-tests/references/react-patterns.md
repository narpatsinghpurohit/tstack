# React Testing Patterns (Detailed)

## Test wrapper with all providers

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

export { screen, waitFor, within, fireEvent } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
```

## MSW setup

```typescript
// apps/web/src/test/msw-server.ts
import { setupServer } from 'msw/node';

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Component test with loading, error, and success states

```typescript
import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw-server';
import { ExampleList } from '../components/example-list';

describe('ExampleList', () => {
  const mockData = [
    { _id: '1', title: 'First', status: 'published' },
    { _id: '2', title: 'Second', status: 'draft' },
  ];

  it('shows loading skeleton initially', () => {
    server.use(
      http.get('/api/v1/examples', async () => {
        await new Promise((r) => setTimeout(r, 100));
        return HttpResponse.json({ data: mockData });
      }),
    );
    renderWithProviders(<ExampleList />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders list of items', async () => {
    server.use(
      http.get('/api/v1/examples', () =>
        HttpResponse.json({ data: mockData, status: 200, message: 'OK' }),
      ),
    );
    renderWithProviders(<ExampleList />);
    await waitFor(() => {
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    server.use(http.get('/api/v1/examples', () => HttpResponse.error()));
    renderWithProviders(<ExampleList />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
```

## Form component test

```typescript
import { renderWithProviders, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { ExampleForm } from '../components/example-form';

it('validates required fields', async () => {
  const user = userEvent.setup();
  renderWithProviders(<ExampleForm />);

  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/required/i)).toBeInTheDocument();
});

it('submits valid form', async () => {
  const user = userEvent.setup();
  renderWithProviders(<ExampleForm />);

  await user.type(screen.getByLabelText(/title/i), 'Test Title');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Assert mutation was called via MSW handler
});
```

## Accessibility testing

```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = renderWithProviders(<ExampleList />);
  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```
