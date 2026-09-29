# Tasks Specification

## Phase 1: Project Setup & Configuration

### TASK-1.1: Initialize Monorepo
- [x] Create root `package.json` with npm workspaces
- [x] Configure TypeScript project references
- [x] Set up ESLint + Prettier (shared config)
- [x] Configure Git hooks (husky + lint-staged)
- [x] Create `.gitignore`, `.env.example`

### TASK-1.2: Shared Package Setup
- [x] Create `packages/shared/package.json`
- [x] Configure `tsconfig.json` for shared types
- [x] Define shared Zod schemas (auth, snailpay, user)
- [x] Export snail names, validation constants
- [x] Build script for shared package

### TASK-1.3: Frontend Setup
- [x] Create `apps/frontend` with Vite + React + TypeScript
- [x] Configure `tsconfig.json`, `vite.config.ts`
- [x] Set up React Router, React Hook Form, Zod
- [x] Install charting library (Chart.js instead of Recharts)
- [x] Configure path aliases (`@/`, `@shared/`)
- [x] Set up Vitest + React Testing Library

### TASK-1.4: Backend Setup
- [x] Create `apps/backend` with Express + TypeScript
- [x] Configure `tsconfig.json`, `tsx` for dev
- [x] Set up middleware: CORS, Helmet, JSON parser
- [x] Configure Vitest + Supertest
- [x] Set up path aliases

---

## Phase 2: Authentication Feature

### TASK-2.1: Backend Auth Implementation
- [x] Create User model (in-memory Map for demo)
- [x] Implement password hashing (bcrypt)
- [x] Create JWT token generation/validation
- [x] Implement `POST /api/auth/register`
  - [x] Validate input (Zod)
  - [x] Check email uniqueness
  - [x] Hash password
  - [x] Create user with balance: 0
  - [x] Return token + user
- [x] Implement `POST /api/auth/login`
  - [x] Validate input
  - [x] Verify password
  - [x] Return token + user
- [x] Create auth middleware for protected routes
- [x] Implement `GET /api/auth/me` endpoint
- [ ] Write unit tests for auth service
- [ ] Write integration tests for auth endpoints

### TASK-2.2: Frontend Auth Implementation
- [x] Create `AuthContext` with state: user, token, isAuthenticated
- [x] Implement `useAuth` hook
- [x] Create `useLocalStorage` hook for persistence (via AuthContext)
- [x] Build `LoginForm` with React Hook Form + Zod
- [x] Build `RegisterForm` with validation
- [x] Create `AuthLayout` for auth pages
- [x] Implement `LoginPage` and `RegisterPage`
- [x] Create protected route wrapper
- [x] Set up API service with axios/fetch
- [x] Add `refreshUser()` to fetch fresh data from `/auth/me`
- [ ] Write component tests for forms
- [ ] Write integration test for auth flow

---

## Phase 3: Dashboard Feature

### TASK-3.1: Dashboard Layout & Components
- [x] Create `DashboardLayout` with header, sidebar
- [x] Build `UserHeader` (name, logout button)
- [x] Build `BalanceCard` (current balance display)
- [x] Implement responsive grid layout

### TASK-3.2: Charts Implementation
- [x] Create `BetsDonutChart` (won vs lost bets)
  - [x] Simulated data generation
  - [x] Chart.js donut configuration
  - [x] Responsive, accessible
- [x] Create `SnailVictoriesBarChart`
  - [x] 6 snails with names
  - [x] 6 races per day simulation
  - [x] Bar chart with victories per snail
  - [x] Consistent simulated data

### TASK-3.3: SnailPay Integration (Frontend)
- [x] Create `SnailPayModal` component
- [x] Build payment form with validation
- [x] Implement `useSnailPay` hook (via snailPayService)
- [x] Connect to backend API
- [x] Handle success: update balance, show toast
- [x] Handle errors: display user-friendly messages
- [x] Save fictional card data to localStorage (per requirements)

### TASK-3.4: Dashboard Page Assembly
- [x] Create `DashboardPage` composing all components
- [x] Wire up AuthContext for user data
- [x] Ensure balance updates reactively (via updateBalance)
- [x] Persist bet stats & snail victories in localStorage per user
- [ ] Write component tests for dashboard
- [ ] Write integration test for SnailPay flow

---

## Phase 4: SnailPay Backend Service

### TASK-4.1: SnailPay Service Implementation
- [x] Create `SnailPayService` class
- [x] Implement charge processing logic
- [x] Define success conditions (exact card match)
- [x] Implement transaction error scenarios
  - [x] Invalid card number
  - [x] Expired card
  - [x] Invalid CVV
  - [x] Declined card (specific test numbers)
- [x] Implement system error simulation
  - [x] Header-based trigger: `x-snailpay-simulate-error`
  - [x] Or environment variable
- [x] Generate proper response format
  - [x] Unique ID (UUID)
  - [x] Status: approved/rejected/error
  - [x] Status detail messages
  - [x] Authorization code (on success)
  - [x] Reference number
  - [x] Payer info

### TASK-4.2: SnailPay API Endpoint
- [x] Create `POST /api/snailpay/charge` route
- [x] Add auth middleware
- [x] Validate request body (Zod)
- [x] Call SnailPayService
- [x] Return standardized response
- [x] **Update user balance in backend on approved charge**
- [ ] Write unit tests for service
- [ ] Write integration tests for endpoint
- [ ] Test all response scenarios

---

## Phase 5: Polish & Testing

### TASK-5.1: End-to-End Testing
- [x] Full registration → login → dashboard → SnailPay flow
- [x] Session persistence across reloads
- [x] Protected route enforcement
- [ ] Error boundary testing

### TASK-5.2: UI/UX Polish
- [x] Consistent design system (colors, spacing, typography)
- [x] Loading states for all async operations
- [x] Error toasts/notifications
- [x] Form validation feedback
- [x] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (ARIA, keyboard nav, contrast)

### TASK-5.3: Documentation
- [ ] README with setup/run instructions
- [ ] API documentation (endpoints, examples)
- [ ] SnailPay test scenarios documentation
- [ ] Test running instructions

### TASK-5.4: Optional Enhancements
- [ ] Deploy to Vercel/Netlify (frontend) + Railway/Render (backend)
- [ ] Database design proposal document

---

## Task Dependencies

```
TASK-1.1 → TASK-1.2, TASK-1.3, TASK-1.4 (parallel)
TASK-1.2 → TASK-2.1, TASK-2.2 (shared types needed)
TASK-1.3 → TASK-2.2, TASK-3.1, TASK-3.2, TASK-3.3
TASK-1.4 → TASK-2.1, TASK-4.1
TASK-2.1 → TASK-2.2 (backend auth before frontend)
TASK-2.2 → TASK-3.1, TASK-3.3 (auth context needed)
TASK-3.1 → TASK-3.2, TASK-3.3 (layout before charts/modal)
TASK-4.1 → TASK-3.3 (backend SnailPay before frontend integration)
TASK-3.2, TASK-3.3 → TASK-3.4
All Phase 3 → TASK-5.1
TASK-5.1 → TASK-5.2, TASK-5.3
TASK-5.2, TASK-5.3 → TASK-5.4
```

---

## Definition of Done Per Task
- [ ] Code implements specified functionality
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (where applicable)
- [ ] Component documented with JSDoc/TSDoc
- [ ] No console errors/warnings in browser
- [ ] Responsive on target breakpoints