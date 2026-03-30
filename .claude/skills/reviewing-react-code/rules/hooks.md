# Hooks Rules (Non-Negotiable)

Violations block merge. No exceptions.

## HOOKS-1: No suppressed exhaustive-deps warnings

Silencing the linter hides stale closure bugs. Fix the dependency array instead.

```typescript
// VIOLATION
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// FIX: Include the dependency
useEffect(() => {
  fetchData(userId);
}, [userId]);

// If a function dep causes re-runs, move logic inside the effect
// or stabilize with useCallback (only if genuinely needed)
```

## HOOKS-2: useEffect with side effects MUST have cleanup

Missing cleanup causes memory leaks, state updates on unmounted components, and race conditions.

**Fetch requests** → AbortController:
```typescript
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => { if (e.name !== 'AbortError') throw e; });
  return () => controller.abort();
}, [url]);
```

**Timers** → clear in cleanup:
```typescript
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

**Event listeners** → remove in cleanup:
```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => { /* ... */ };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

**Subscriptions** → unsubscribe in cleanup:
```typescript
useEffect(() => {
  const sub = eventBus.subscribe('event', handler);
  return () => sub.unsubscribe();
}, []);
```

## HOOKS-3: No derived state in useEffect

If a value can be computed from props or existing state, compute it during render. useEffect is only for syncing with external systems (APIs, browser APIs, subscriptions).

This is a core React principle from "Thinking in React": state should be minimal -- don't store what you can compute.

```typescript
// VIOLATION: Extra render cycle, stale UI flash
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// FIX: Compute during render
const fullName = `${first} ${last}`;
```

```typescript
// VIOLATION: Filtering via useEffect
const [filtered, setFiltered] = useState(items);
useEffect(() => {
  setFiltered(items.filter((i) => i.name.includes(query)));
}, [items, query]);

// FIX: Derive during render
const filtered = items.filter((i) => i.name.includes(query));
// Use useMemo only if profiling shows it's expensive:
// const filtered = useMemo(() => items.filter(...), [items, query]);
```

**Decision test** (from React docs): For each piece of data, ask:
1. Does it remain unchanged over time? → Not state.
2. Is it passed from a parent via props? → Not state.
3. Can you compute it from existing state or props? → Definitely not state.

## HOOKS-4: No state updates on unmounted components

Async operations must check mounted status or use AbortController to prevent "Can't perform a React state update on an unmounted component" errors.

```typescript
// VIOLATION: State update after unmount
useEffect(() => {
  fetchData().then(setData);
}, []);

// FIX: AbortController (preferred)
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal }).then(setData);
  return () => controller.abort();
}, []);
```

## HOOKS-5: Hooks must be called at the top level

Never call hooks inside conditions, loops, or nested functions. This is a fundamental React rule.

```typescript
// VIOLATION
if (isLoggedIn) {
  const [name, setName] = useState('');
}

// FIX: Always call, conditionally use
const [name, setName] = useState('');
// Use `name` conditionally in render
```
