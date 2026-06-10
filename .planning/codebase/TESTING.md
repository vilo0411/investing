# Testing Patterns

**Analysis Date:** 2026-06-10

## Test Framework

**Runner:**
- None configured. No `vitest`, `jest`, or `playwright` dependency in `package.json`.
- Config: Not present (no `vitest.config.*`, `jest.config.*`, `playwright.config.*`).

**Assertion Library:**
- Not applicable — no test framework installed.

**Run Commands:**
```bash
npm run build    # astro check && astro build — the only validation step
npm run dev      # astro dev --host 0.0.0.0
npm run preview  # astro preview --host 0.0.0.0
```

## Current Validation Strategy

This is a static, content-driven Astro site (SEO content production for ValueInvesting.com.vn). Validation currently relies on:

1. **Type checking:** `astro check` (run as part of `npm run build`) validates `.astro` files, TypeScript types, and Astro component prop usage against `tsconfig.json` (`astro/tsconfigs/strict`).
2. **Content schema validation:** `src/content.config.ts` defines a Zod schema for the `articles` collection. Any `.md` file in `src/content/articles/` with frontmatter that doesn't match the schema (missing required fields, wrong types) will fail the build.
3. **Build success:** `astro build` failing is the de facto integration test — broken imports, invalid routes (`getStaticPaths`), or malformed content collections will throw at build time.
4. **Editorial QA via agent workflows:** Content quality (anti-AI patterns, brand voice, SEO formatting) is enforced through `.antigravity/agents/quality-guardian.md` and `.antigravity/rules/*.md` — this is a manual/agent-driven QA process, not automated test code.

## Test File Organization

**Location:** None — no test directory or test files exist anywhere in `src/` or repo root.

**Naming:** N/A

**Structure:** N/A

## Test Structure

Not applicable. No test suites exist.

## Mocking

Not applicable — no test framework or mocking library installed.

## Fixtures and Factories

**Test Data:** None. "Fixtures" in this project are real content files (`src/content/articles/*.md`) validated against the Zod schema in `src/content.config.ts` at build time.

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

## Test Types

**Unit Tests:** Not used.

**Integration Tests:** Not used. Closest equivalent is `astro check && astro build` succeeding without errors.

**E2E Tests:** Not used.

## Recommendations for Adding Automated Tests

If a future phase introduces automated testing for this Astro project, follow these conventions to align with the existing stack:

- **Recommended runner:** Vitest (integrates cleanly with Astro/Vite, TypeScript-native, matches `"type": "module"` in `package.json`).
- **Component testing:** Use `@astrojs/test` / `experimental-container` API (Astro Container API) for rendering `.astro` components in isolation, or Playwright for full-page E2E given this is a content site.
- **Content schema tests:** Add a Vitest suite that imports `src/content.config.ts` and validates sample frontmatter objects against the Zod schema directly — this catches schema regressions without a full Astro build.
- **Path alias support:** Configure `vitest.config.ts` to resolve `@/*` → `src/*` to match `tsconfig.json`.
- **Place new test files** under `src/**/*.test.ts` co-located with source, or a top-level `tests/` directory if E2E (Playwright) is introduced — to be decided when tests are first added since no precedent exists.

---

*Testing analysis: 2026-06-10*
