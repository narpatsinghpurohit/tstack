# Type Safety Rules (Non-Negotiable)

Violations block merge. No exceptions.

## TS-1: No `any` type

Zero tolerance. `any` disables TypeScript's entire type system for that value and everything it touches. Use `unknown` and narrow with type guards, or use the correct specific type.

```typescript
// VIOLATION
function processData(data: any) { return data.name; }
const items: any[] = response.data;
const handler = (e: any) => {};

// FIX: Specific type
function processData(data: UserResponse) { return data.name; }
const items: UserResponse[] = response.data;
const handler = (e: React.ChangeEvent<HTMLInputElement>) => {};

// FIX: unknown + narrowing (when type isn't known at compile time)
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name;
  }
  throw new Error('Invalid data shape');
}
```

## TS-2: No @ts-ignore without justification

`@ts-ignore` silences type errors unconditionally. If it must be used (rare), it requires:
1. A comment explaining exactly why
2. A linked issue or TODO for removal

```typescript
// VIOLATION
// @ts-ignore
const result = brokenLibraryCall();

// ACCEPTABLE (rare)
// @ts-expect-error -- library @types/foo missing overload for v3.x, tracked in #142
const result = brokenLibraryCall();
```

Prefer `@ts-expect-error` over `@ts-ignore` -- it errors when the suppression is no longer needed, preventing stale ignores.

## TS-3: Use `import type` for type-only imports

Prevents runtime import of modules that are only needed for type checking. Reduces bundle size.

```typescript
// VIOLATION
import { UserResponse, CreateUserDto } from '@tstack/shared';

// FIX (when only using as types)
import type { UserResponse, CreateUserDto } from '@tstack/shared';

// When importing both values and types:
import { createUserSchema } from '@tstack/shared';
import type { CreateUserDto } from '@tstack/shared';
```

## TS-4: No type duplication

Types shared between frontend and backend must come from `@shared` package. Never redefine the same interface locally.

```typescript
// VIOLATION: Local copy of a shared type
interface User {
  _id: string;
  email: string;
  name: string;
}

// FIX: Import from shared package
import type { UserResponse } from '@tstack/shared';
```

## TS-5: Use discriminated unions for mutually exclusive states

Don't model impossible states with optional booleans. Use discriminated unions so TypeScript prevents invalid combinations at compile time.

```typescript
// VIOLATION: Multiple booleans allow impossible states
interface RequestState {
  isLoading: boolean;
  isError: boolean;
  data?: User;
  error?: Error;
}
// Bug: isLoading=true AND isError=true is representable

// FIX: Discriminated union
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
// Impossible to have loading AND error simultaneously
```
