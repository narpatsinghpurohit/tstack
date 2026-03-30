# Accessibility Rules -- WCAG 2.2 AA (Non-Negotiable)

Violations block merge. No exceptions.

**Core principle: Use shadcn/ui components.** They have accessibility built in -- keyboard navigation, focus management, ARIA attributes, and screen reader support are all handled. Rolling your own interactive component when shadcn has one is itself a violation.

## A11Y-1: Use shadcn/ui for interactive elements

shadcn/ui components are pre-built with full accessibility. Always prefer them over custom implementations.

| Need | Use shadcn/ui | NOT this |
|------|--------------|----------|
| Clickable action | `<Button>` | `<div onClick>` |
| Modal/popup | `<Dialog>` | Custom modal div |
| Dropdown | `<DropdownMenu>` | Custom div menu |
| Selection | `<Select>` | Custom `<div>` list |
| Toggle | `<Switch>` or `<Toggle>` | `<div onClick>` with state |
| Tabs | `<Tabs>` | Custom tab implementation |
| Tooltip | `<Tooltip>` | CSS `:hover` tooltip |
| Toast/notification | `<Sonner>` or `<Toast>` | Custom notification div |
| Alert | `<Alert>` or `<AlertDialog>` | Custom alert div |
| Form fields | `<Input>`, `<Textarea>`, `<Checkbox>`, `<RadioGroup>` | Unstyled bare elements |
| Navigation menu | `<NavigationMenu>` | Custom `<ul>` nav |
| Accordion | `<Accordion>` | Custom show/hide div |
| Sheet/drawer | `<Sheet>` | Custom sliding panel |
| Command palette | `<Command>` | Custom search modal |

```typescript
// VIOLATION: Custom clickable div -- no keyboard, no ARIA, no focus
<div className="cursor-pointer" onClick={handleDelete}>Delete</div>

// FIX: shadcn Button -- keyboard, focus, ARIA all handled
import { Button } from '@/components/ui/button';
<Button variant="destructive" onClick={handleDelete}>Delete</Button>
```

```typescript
// VIOLATION: Custom modal -- no focus trap, no escape handling, no ARIA
<div className={isOpen ? 'block' : 'hidden'}>
  <div className="overlay" onClick={close} />
  <div className="modal-content">{children}</div>
</div>

// FIX: shadcn Dialog -- focus trap, Escape key, aria-modal, focus restore all built in
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    {children}
  </DialogContent>
</Dialog>
```

## A11Y-2: All form inputs must have labels

Use shadcn/ui `<Label>` component. Placeholder text alone is never a label.

```typescript
// VIOLATION
<Input type="email" placeholder="Email" />

// FIX: shadcn Label + Input
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

// With react-hook-form + shadcn Form components (preferred for forms):
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
<FormField control={form.control} name="email" render={({ field }) => (
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl><Input {...field} /></FormControl>
    <FormMessage />  {/* Auto aria-live error messages */}
  </FormItem>
)} />
```

## A11Y-3: All images must have alt text

```typescript
// VIOLATION
<img src="/logo.png" />

// FIX: Informative
<img src="/logo.png" alt="ExamGuru logo" />

// FIX: Decorative
<img src="/divider.png" alt="" />
```

## A11Y-4: Focus indicators must never be removed

Keyboard users rely on visible focus. Never `outline: none` without a replacement.

shadcn/ui components have focus-visible styles built in. If you're writing custom CSS:

```css
/* VIOLATION */
button:focus { outline: none; }

/* FIX: Already handled by shadcn -- don't override focus styles.
   If custom styling is needed: */
button:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

## A11Y-5: Dynamic content changes must be announced

Use shadcn/ui `<Toast>` / `<Sonner>` for notifications (built-in aria-live). For inline messages:

```typescript
// VIOLATION: Error appears but screen reader doesn't know
{error ? <p className="text-red-500">{error}</p> : null}

// FIX: Use shadcn FormMessage (auto aria) in forms, or add aria-live
<div aria-live="polite" aria-atomic="true">
  {error ? <p className="text-destructive">{error}</p> : null}
</div>

// FIX: For toasts, use shadcn Sonner -- aria-live built in
import { toast } from 'sonner';
toast.error('Failed to save');
```

## A11Y-6: No custom interactive component when shadcn has one

If shadcn/ui provides a component for the use case, use it. Custom implementations miss keyboard handling, ARIA, focus management, and screen reader support that shadcn gets right.

The only valid reason to build custom: shadcn doesn't have a component for the pattern AND no Radix UI primitive exists for it.
