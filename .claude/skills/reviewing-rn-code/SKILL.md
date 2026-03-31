---
name: reviewing-rn-code
description: Review React Native mobile code for patterns, performance, accessibility, and project conventions. Enforces non-negotiable rules across feature structure, performance, platform handling, accessibility, and React Native Reusables usage. Use when reviewing mobile code, pull requests, RN components, or the user asks to review React Native or mobile code in apps/mobile.
context: fork
agent: code-reviewer
allowed-tools: Read, Grep, Glob
---

# Reviewing React Native Code

## Severity levels

- **NON-NEGOTIABLE**: Blocks merge. No exceptions.
- **CRITICAL**: Must fix before merge.
- **SUGGESTION**: Should fix.

## Review process

1. Read all files in the feature being reviewed
2. Check against non-negotiable rules in [rules/mobile-rules.md](rules/mobile-rules.md)
3. Check permission coverage using the `permission-guidelines` skill
4. Check for common issues in [references/rn-common-issues.md](references/rn-common-issues.md)
5. Output findings

## Non-negotiable checks

- [ ] 3-file split compliance (hook/view/glue)
- [ ] View file contains ZERO hooks
- [ ] Hook return type === View props type
- [ ] FlatList for lists, not ScrollView + .map()
- [ ] NativeWind className (not inline styles or StyleSheet in views)
- [ ] No web APIs (localStorage, window, document)
- [ ] SafeAreaView on screen roots
- [ ] KeyboardAvoidingView on form screens
- [ ] Typed navigation params
- [ ] accessibilityLabel on all interactive elements
- [ ] Permission gating with useCan

## React Native Reusables checks

- [ ] UI components from `@/components/ui/`, not manual implementations
- [ ] `<Text>` from `@/components/ui/text` for all text (never bare strings)
- [ ] `<Button>` has `<Text>` child (RN Button requires explicit Text)
- [ ] PortalHost in root layout (if using Dialog, DropdownMenu, Select, Tooltip, Popover)
- [ ] Label uses `nativeID` (not `htmlFor`) for form association
- [ ] Input uses `aria-labelledby` to connect to Label
- [ ] Theme tokens from NativeWind (`bg-background`, `text-foreground`) — not hardcoded colors

## Performance checks

- [ ] React.memo on FlatList renderItem components
- [ ] Image caching (react-native-fast-image or expo-image)
- [ ] No large inline objects in JSX (forces re-renders)
- [ ] No unnecessary re-renders from unstable references
- [ ] Reanimated used for complex animations (not Animated API)

## Output format

```markdown
## Code Review: [Screen/Feature Name]

### NON-NEGOTIABLE (blocks merge)
- **[File:Line]** [Rule ID]: [Description and exact fix]

### Critical
- **[File:Line]**: [Description and fix]

### Suggestions
- **[File:Line]**: [Recommendation]

### Passed
- [Categories that passed all checks]
```

## Rules

- [rules/mobile-rules.md](rules/mobile-rules.md) — Non-negotiable mobile rules

## References

- [references/rn-common-issues.md](references/rn-common-issues.md) — Common issues and fixes
