# Component Design Rules (Non-Negotiable)

Based on React's official rules and "Thinking in React" principles. Violations block merge.

**Core principle: Build with shadcn/ui primitives.** Use `Button`, `Card`, `Input`, `Dialog`, `Table`, `Badge`, `Skeleton`, etc. as building blocks. Only create custom components for app-specific logic, never for UI primitives that shadcn already provides.

## COMP-1: Components must be pure

Same props and state must always produce the same JSX output. No side effects during render. No mutating props, state, or hook return values.

```typescript
// VIOLATION: Side effect during render
function Dashboard({ items }) {
  document.title = `${items.length} items`; // Side effect in render
  return <div>{items.length}</div>;
}

// FIX: Use useEffect for side effects
function Dashboard({ items }) {
  useEffect(() => {
    document.title = `${items.length} items`;
  }, [items.length]);
  return <div>{items.length}</div>;
}
```

```typescript
// VIOLATION: Mutating props
function List({ items }) {
  items.sort(); // Mutates the prop array
  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

// FIX: Create a copy
function List({ items }) {
  const sorted = [...items].sort();
  return <ul>{sorted.map((i) => <li key={i}>{i}</li>)}</ul>;
}
```

## COMP-2: Single responsibility

Each component should do one thing. If it grows beyond one clear purpose, decompose it. This is the first step of "Thinking in React."

Signs a component is too big:
- More than ~150 lines of JSX
- Multiple unrelated state variables
- Multiple unrelated useEffect hooks
- Hard to name (the name is vague like `Content` or `Main`)

## COMP-3: Minimal state

From "Thinking in React": figure out the absolute minimal state your component needs. Everything else should be computed.

Three questions for every piece of data:
1. Does it remain unchanged? → Not state (use a constant or prop).
2. Passed from a parent? → Not state (it's a prop).
3. Computable from existing state or props? → Not state (compute during render).

```typescript
// VIOLATION: Redundant state
const [items, setItems] = useState<Item[]>([]);
const [count, setCount] = useState(0);
useEffect(() => setCount(items.length), [items]);

// FIX: Derive count from items
const [items, setItems] = useState<Item[]>([]);
const count = items.length;
```

## COMP-4: State ownership -- closest common parent

State lives in the nearest common ancestor of all components that need it. Don't push state too high (causes unnecessary re-renders) or too low (forces prop drilling or duplicate state).

```typescript
// VIOLATION: State in a top-level provider when only two siblings need it
<AppContext.Provider value={{ searchText, setSearchText }}>
  <Header />
  <SearchBar />   {/* uses searchText */}
  <ResultList />  {/* uses searchText */}
  <Footer />      {/* doesn't use searchText, but re-renders anyway */}
</AppContext.Provider>

// FIX: State in the closest common parent
function SearchPage() {
  const [searchText, setSearchText] = useState('');
  return (
    <>
      <SearchBar value={searchText} onChange={setSearchText} />
      <ResultList query={searchText} />
    </>
  );
}
```

## COMP-5: One-way data flow

Data flows down via props. Changes flow up via callback props. Never reach into children to read their state. Never mutate parent state directly.

```typescript
// VIOLATION: Child mutating parent's ref directly
function Child({ parentRef }) {
  parentRef.current.value = 'hacked';
}

// FIX: Child calls callback, parent updates its own state
function Child({ onValueChange }) {
  return <input onChange={(e) => onValueChange(e.target.value)} />;
}
```

## COMP-6: No direct DOM manipulation

Use React's declarative API. Direct DOM access breaks React's rendering model.

```typescript
// VIOLATION
document.getElementById('title')!.textContent = 'Hello';
document.querySelector('.modal')?.classList.add('open');

// FIX: Use state
const [title, setTitle] = useState('Hello');
return <h1>{title}</h1>;

// FIX: Use ref (when imperative DOM access is genuinely needed)
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();
```

## COMP-7: Error boundaries at route level

Unhandled errors in any component crash the entire React tree. Error boundaries prevent blank screens.

```typescript
// Every route (or route layout) must be wrapped:
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// In route layout
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Outlet />
</ErrorBoundary>
```

## COMP-8: Never call component functions directly

Always use JSX. Calling components as functions breaks hooks, keys, and React's reconciliation.

```typescript
// VIOLATION
function App() {
  return <div>{ProductList({ items })}</div>;
}

// FIX: Use JSX
function App() {
  return <div><ProductList items={items} /></div>;
}
```
