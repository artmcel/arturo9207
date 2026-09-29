# Tasks

## 1. Backend Unit Tests

- [x] 1.1 Create `apps/backend/src/services/__tests__/authService.test.ts` with tests for register, login, getUserById, updateBalance - verify `npm run test:backend` passes authService tests
- [x] 1.2 Create `apps/backend/src/services/__tests__/snailPayService.test.ts` with tests for charge (success, transaction error, system error via header and name) - verify `npm run test:backend` passes snailPayService tests
- [x] 1.3 Create `apps/backend/src/models/__tests__/user.test.ts` with tests for create, findByEmail, findById, updateBalance, toPublic - verify `npm run test:backend` passes user model tests

## 2. Backend Integration Tests

- [x] 2.1 Create `apps/backend/src/routes/__tests__/auth.test.ts` with Supertest tests for POST /api/auth/register (valid, duplicate email, invalid input), POST /api/auth/login (valid, invalid), GET /api/auth/me (with/without token) - verify `npm run test:backend` passes auth integration tests
- [x] 2.2 Create `apps/backend/src/routes/__tests__/snailpay.test.ts` with Supertest tests for POST /api/snailpay/charge (success card, rejected card, system error via header, system error via name, unauthenticated) - verify `npm run test:backend` passes snailpay integration tests

## 3. Frontend Test Setup

- [x] 3.1 Create `apps/frontend/src/test-utils.tsx` with `renderWithProviders` wrapping AuthProvider, ToastProvider, BrowserRouter and mock services - verify file exports render function
- [x] 3.2 Create `apps/frontend/src/mocks/handlers.ts` with factory functions for user, authResponse, snailPayResponse test data - verify exports work in test files
- [x] 3.3 Configure Vitest globals and test environment in `apps/frontend/vite.config.ts` (jsdom, setupFiles) - verify `npm run test:frontend` runs without config errors

## 4. Frontend Component Tests

- [x] 4.1 Create `apps/frontend/src/components/auth/__tests__/LoginForm.test.tsx` with tests for rendering, valid submit (calls login, navigates), invalid email (shows Zod error), empty fields - verify `npm run test:frontend` passes LoginForm tests
- [x] 4.2 Create `apps/frontend/src/components/auth/__tests__/RegisterForm.test.tsx` with tests for rendering, valid submit (calls register, navigates), password mismatch (shows error), invalid email - verify `npm run test:frontend` passes RegisterForm tests
- [x] 4.3 Create `apps/frontend/src/components/dashboard/__tests__/SnailPayModal.test.tsx` with tests for rendering open modal, success card submit (calls charge, shows success toast, calls updateBalance, closes), rejected card (shows error toast), system error - verify `npm run test:frontend` passes SnailPayModal tests

## 5. Frontend Context & Page Tests

- [x] 5.1 Create `apps/frontend/src/contexts/__tests__/AuthContext.test.tsx` with tests for initial load from localStorage, login sets token/user, logout clears, updateBalance updates state and localStorage, refreshUser fetches from /auth/me - verify `npm run test:frontend` passes AuthContext tests
- [x] 5.2 Create `apps/frontend/src/pages/__tests__/DashboardPage.test.tsx` with tests for rendering with auth (shows user, balance, charts, button, logout), logout navigates to login, balance update re-renders BalanceCard - verify `npm run test:frontend` passes DashboardPage tests

## 6. Test Scripts & Verification

- [x] 6.1 Ensure `apps/backend/package.json` has test script: `"test": "vitest run"` - verify `npm run test:backend` executes
- [x] 6.2 Ensure `apps/frontend/package.json` has test script: `"test": "vitest run"` - verify `npm run test:frontend` executes
- [x] 6.3 Ensure root `package.json` has `"test": "npm run test --workspaces"` - verify `npm run test` runs both workspaces
- [x] 6.4 Run full test suite and verify all tests pass - verify `npm run test` exits 0 with all tests passing