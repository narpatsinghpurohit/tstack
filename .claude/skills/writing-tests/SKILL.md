---
name: writing-tests
description: Write tests following project patterns. NestJS unit tests with mocked repositories via overrideProvider, e2e tests with Supertest and mongodb-memory-server. React tests with React Testing Library + MSW. React Native tests with RNTL + MSW. Use when writing tests, adding test coverage, testing a module, component, feature, or endpoint.
disable-model-invocation: true
argument-hint: [what-to-test]
---

## Task
Write tests for: $ARGUMENTS

---

# Writing Tests

## Determine test type

**Backend (apps/api)?**
- Unit test for service/controller → NestJS patterns
- E2E test for full HTTP flow → Supertest + mongodb-memory-server

**Web (apps/web)?**
- Component test → React Testing Library + MSW
- Hook test → renderHook + QueryClientProvider
- Store test → Direct Zustand state manipulation

**Mobile (apps/mobile)?**
- Screen test → Jest + React Native Testing Library + MSW
- Hook test → renderHook + QueryClientProvider + NavigationContainer
- Navigation test → NavigationContainer wrapper with initialParams

## Conventions

- File naming: `<name>.spec.ts` (backend), `<name>.test.tsx` (web and mobile)
- One `describe` block per class/component
- Nested `describe` per method/behavior
- Test names: `it('should <expected behavior>')`
- No test logic in loops — write explicit test cases
- Target 80%+ coverage

## Examples

- [examples/nestjs-test.md](examples/nestjs-test.md) — NestJS unit test with mocked repos
- [examples/react-test.md](examples/react-test.md) — React web component test with MSW
- [examples/rn-test.md](examples/rn-test.md) — React Native screen test with RNTL

## References

- [references/react-patterns.md](references/react-patterns.md) — React web test patterns
- [references/rn-patterns.md](references/rn-patterns.md) — React Native test patterns
