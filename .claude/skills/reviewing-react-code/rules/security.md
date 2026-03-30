# Security Rules (Non-Negotiable)

Violations block merge. No exceptions.

## SEC-1: No dangerouslySetInnerHTML without sanitization

`dangerouslySetInnerHTML` bypasses React's built-in XSS protection. If used without DOMPurify, it's a direct XSS vulnerability.

```typescript
// VIOLATION
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// FIX
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// BEST: Don't use dangerouslySetInnerHTML at all
<div>{userContent}</div>
```

## SEC-2: No inline secrets or API keys

All secrets must come from environment variables. Never commit credentials to source code.

```typescript
// VIOLATION
const API_KEY = 'sk-abc123def456';
const client = axios.create({ headers: { 'X-API-Key': 'hardcoded-key' } });

// FIX
const API_KEY = import.meta.env.VITE_API_KEY;
```

## SEC-3: No eval, new Function, or document.write

These are code injection vectors.

```typescript
// VIOLATION
eval(userInput);
new Function('return ' + userInput)();
document.write(someHtml);

// These have no valid use case in a React application.
```

## SEC-4: No unsanitized user input in URLs

User-provided values in `href`, `src`, or `action` attributes can execute `javascript:` protocol attacks.

```typescript
// VIOLATION
<a href={userProvidedUrl}>Link</a>
<iframe src={userUrl} />

// FIX: Validate protocol
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
