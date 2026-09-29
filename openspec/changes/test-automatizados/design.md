# Design

## Context

See proposal.md - Why. The app has all core features implemented (auth, dashboard, SnailPay) but zero test coverage. Need to add tests across backend (Express + TypeScript) and frontend (React + TypeScript + Vite).

Current stack:
- Backend: Express, TypeScript, Vitest (configured), in-memory user store
- Frontend: React 18, Vite, TypeScript, React Router, React Hook Form, Zod, Chart.js
- Shared: Zod schemas, types, constants in `packages/shared`

## Goals / Non-Goals

**Goals:**
- Unit tests for backend services (authService, snailPayService, userModel) - isolated with mocks
- Integration tests for API endpoints (auth, snailpay) - real HTTP with Supertest
- Component tests for frontend (LoginForm, RegisterForm, SnailPayModal, DashboardPage) - RTL + Vitest
- Test scripts in package.json workspaces
- All tests pass in CI-like environment

**Non-Goals:**
- E2E tests (Playwright/Cypress) - out of scope per requirements
- Coverage thresholds - evaluate what to test, not percentage
- Test database - using in-memory store, no real DB
- Visual regression testing

## Decisions

### 1. Test Framework: Vitest (already configured)
**Rationale**: Already in package.json for both frontend and backend. Native ESM support, fast, Jest-compatible API.
**Alternatives**: Jest (more config), Mocha (more setup)

### 2. Backend Integration Tests: Supertest + real Express app
**Rationale**: Tests real middleware chain (auth, validation, error handling). In-memory user store resets per test file via `beforeEach`.
**Alternatives**: Mock HTTP (msw) - doesn't test real middleware

### 3. Frontend Component Tests: React Testing Library + Vitest
**Rationale**: RTL is standard for React, tests user behavior not implementation. Vitest provides test runner + mocking.
**Alternatives**: Enzyme (deprecated), Cypress component (heavier)

### 4. Mocking Strategy
- **Backend unit**: Mock `userModel` (Map) with manual reset in `beforeEach`
- **Backend integration**: Real Express app, fresh in-memory store per test suite
- **Frontend**: Mock `authService`, `snailPayService` at module level with `vi.mock`
- **AuthContext**: Wrap components in test providers with controlled state

### 5. Test File Organization
```
apps/backend/src/
  services/__tests__/authService.test.ts
  services/__tests__/snailPayService.test.ts
  models/__tests__/user.test.ts
  routes/__tests__/auth.test.ts
  routes/__tests__/snailpay.test.ts

apps/frontend/src/
  components/auth/__tests__/LoginForm.test.tsx
  components/auth/__tests__/RegisterForm.test.tsx
  components/dashboard/__tests__/SnailPayModal.test.tsx
  pages/__tests__/DashboardPage.test.tsx
  contexts/__tests__/AuthContext.test.tsx
```

### 6. Shared Test Utilities
- `test-utils.tsx`: renderWithProviders (AuthProvider, ToastProvider, BrowserRouter)
- `mocks/`: factory functions for user, authResponse, snailPayResponse

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| In-memory store shared across tests | Reset in `beforeEach` using new Map instance |
| Async auth initialization in tests | Mock AuthContext with controlled loading state |
| Chart.js canvas in jsdom | Mock Chart.js or test component renders without asserting chart internals |
| localStorage in jsdom | Use `vi.spyOn(Storage.prototype, 'getItem/setItem')` or jsdom's native localStorage |
| Token in axios interceptor | Mock `localStorage.getItem('sisu_token')` in tests |

## Migration Plan

1. Add test dependencies (already present: vitest, @testing-library/react, supertest)
2. Create test files following organization above
3. Add test scripts to workspace package.json files
4. Run `npm run test` - all pass
5. No deployment changes needed

## Open Questions

- Whether to test Chart.js rendering (canvas in jsdom is limited) - likely mock chart components
- Exact error message strings for SnailPay rejection scenarios - will use actual service output