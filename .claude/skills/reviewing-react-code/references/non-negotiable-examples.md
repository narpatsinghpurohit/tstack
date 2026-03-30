# Non-Negotiable Violations: Examples and Fixes

## Security

### dangerouslySetInnerHTML without sanitization

```typescript
// VIOLATION: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// FIX: Sanitize with DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// BEST: Avoid dangerouslySetInnerHTML entirely -- render as text
<div>{userContent}</div>
```

### Unsanitized URL rendering

```typescript
// VIOLATION: javascript: protocol injection
<a href={userProvidedUrl}>Link</a>

// FIX: Validate URL protocol
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
<a href={isSafeUrl(url) ? url : '#'}>Link</a>
```

---

## Hooks

### Suppressed exhaustive-deps

```typescript
// VIOLATION: Silencing the linter hides stale closure bugs
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// FIX: Include the dependency, stabilize the function if needed
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### Missing useEffect cleanup

```typescript
// VIOLATION: Memory leak -- fetch continues after unmount
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then((r) => r.json())
    .then(setUser);
}, [id]);

// FIX: AbortController cancels on unmount
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser)
    .catch((e) => {
      if (e.name !== 'AbortError') throw e;
    });
  return () => controller.abort();
}, [id]);
```

```typescript
// VIOLATION: Timer never cleared
useEffect(() => {
  const id = setInterval(() => tick(), 1000);
}, []);

// FIX: Clear in cleanup
useEffect(() => {
  const id = setInterval(() => tick(), 1000);
  return () => clearInterval(id);
}, []);
```

### Derived state in useEffect

```typescript
// VIOLATION: Extra render cycle, stale UI flash
const [items, setItems] = useState<Item[]>([]);
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0));
}, [items]);

// FIX: Compute during render
const total = items.reduce((sum, i) => sum + i.price, 0);
```

```typescript
// VIOLATION: Filtering via useEffect
const [query, setQuery] = useState('');
const [filtered, setFiltered] = useState(items);
useEffect(() => {
  setFiltered(items.filter((i) => i.name.includes(query)));
}, [items, query]);

// FIX: Derive during render (or useMemo for expensive operations)
const filtered = items.filter((i) => i.name.includes(query));
```

---

## Accessibility

### No keyboard access

```typescript
// VIOLATION: div with onClick is not keyboard accessible
<div onClick={handleClick}>Click me</div>

// FIX: Use shadcn Button
import { Button } from '@/components/ui/button';
<Button onClick={handleClick}>Click me</Button>

// For link-style: variant="link", for icon-only: variant="ghost" + size="icon"
<Button variant="ghost" size="icon" onClick={handleClick}>
  <TrashIcon className="h-4 w-4" />
</Button>
```

### Removed focus outline

```css
/* VIOLATION: Invisible focus for keyboard users */
button:focus { outline: none; }

/* FIX: Replace with visible alternative */
button:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### Missing form labels

```typescript
// VIOLATION: No label association
<input type="email" placeholder="Email" />

// FIX: shadcn Label + Input
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

// FIX: shadcn Form components with react-hook-form (preferred for forms)
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
<FormField control={form.control} name="email" render={({ field }) => (
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl><Input {...field} /></FormControl>
    <FormMessage />
  </FormItem>
)} />
```

### Missing alt text

```typescript
// VIOLATION
<img src="/logo.png" />

// FIX: Informative image
<img src="/logo.png" alt="Company logo" />

// FIX: Decorative image
<img src="/divider.png" alt="" />
```

### Modal without focus trap

```typescript
// VIOLATION: Custom modal without focus trap
<div className={isOpen ? 'block' : 'hidden'}>
  <div className="overlay" onClick={close} />
  <div className="content">{children}</div>
</div>

// FIX: shadcn Dialog -- focus trap, Escape, aria-modal, focus restore all built in
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Confirm action</DialogTitle></DialogHeader>
    {children}
  </DialogContent>
</Dialog>

// For destructive confirmations: use AlertDialog
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
```

---

## Type safety

### any type usage

```typescript
// VIOLATION
function processData(data: any) { return data.name; }

// FIX: Use specific type
function processData(data: UserResponse) { return data.name; }

// FIX: Use unknown and narrow
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name;
  }
  throw new Error('Invalid data shape');
}
```

---

## Components

### Direct DOM manipulation

```typescript
// VIOLATION
useEffect(() => {
  document.getElementById('title')!.textContent = 'Hello';
}, []);

// FIX: Use React state
const [title, setTitle] = useState('Hello');
return <h1>{title}</h1>;

// FIX: Use ref when needed
const ref = useRef<HTMLHeadingElement>(null);
```

### Missing error boundary

```typescript
// VIOLATION: Unhandled error crashes the entire app

// FIX: Wrap route with error boundary using shadcn components in fallback
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
      <Button variant="outline" onClick={resetErrorBoundary} className="mt-4">
        Try again
      </Button>
    </Alert>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <RouteComponent />
</ErrorBoundary>
```
