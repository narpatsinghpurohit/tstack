# Vercel React Best Practices Reference

## Critical: Eliminating Waterfalls

- **async-parallel**: Use `Promise.all()` for independent async operations instead of sequential `await`
- **async-defer-await**: Move `await` into the branch where the value is actually used

## Critical: Bundle Size

- **bundle-barrel-imports**: Import directly from modules, never from barrel `index.ts` files
- **bundle-dynamic-imports**: Use `React.lazy()` for heavy components not needed on initial load
- **bundle-defer-third-party**: Load analytics/logging after hydration
- **bundle-preload**: Preload resources on hover/focus for perceived speed

## Medium: Re-render Optimization

- **rerender-memo**: Extract expensive computations into memoized child components
- **rerender-functional-setstate**: Use `setState(prev => ...)` for stable callbacks
- **rerender-lazy-state-init**: Pass function to `useState` for expensive initial values: `useState(() => compute())`
- **rerender-derived-state**: Subscribe to derived booleans, not raw objects
- **rerender-derived-state-no-effect**: Derive state during render, not in `useEffect`
- **rerender-dependencies**: Use primitive values in effect dependency arrays
- **rerender-move-effect-to-event**: Put interaction logic in event handlers, not effects

## Medium: Rendering Performance

- **rendering-hoist-jsx**: Extract static JSX outside components to avoid re-creation
- **rendering-conditional-render**: Use ternary `condition ? <A /> : null` instead of `condition && <A />`
- **rendering-content-visibility**: Use `content-visibility: auto` for long lists
- **rendering-usetransition-loading**: Prefer `useTransition` over manual loading state

## Low-Medium: JavaScript Performance

- **js-set-map-lookups**: Use `Set`/`Map` for O(1) lookups instead of array methods
- **js-combine-iterations**: Combine `filter().map()` into single `.reduce()` or loop
- **js-early-exit**: Return early from functions to avoid unnecessary work
- **js-index-maps**: Build a `Map` for repeated lookups in the same dataset
- **js-length-check-first**: Check `.length` before expensive array comparisons
