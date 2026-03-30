---
name: starter-kit-transformation
description: Project is being transformed from exam-ai-guru product into a generic multi-tenant SaaS starter kit for forking
type: project
---

The exam-ai-guru-v2 monorepo is being refactored into a generic, reusable starter kit that ships with auth, RBAC, multi-tenancy, superadmin portal, and base infrastructure. All domain-specific modules (courses, subjects, batches, students, teachers, chapters, question papers, exams, evaluations, reports) will be stripped out.

**Why:** The user wants a foundation that anyone can fork and build their own product on top of. The exam-specific features are product concerns that should not ship in the starter kit.

**How to apply:** All architectural decisions should favor genericity over domain-specificity. When adding new features, ensure they are platform-level (auth, RBAC, multi-tenancy, settings) not product-level. The shared package, permissions catalog, seed data, and frontend routes must all be domain-neutral.
