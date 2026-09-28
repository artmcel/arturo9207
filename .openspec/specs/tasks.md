# Tasks Specification

## Phase 1: Project Setup & Configuration

### TASK-1.1: Initialize Monorepo
- [ ] Create root `package.json` with npm workspaces
- [ ] Configure TypeScript project references
- [ ] Set up ESLint + Prettier (shared config)
- [ ] Configure Git hooks (husky + lint-staged)
- [ ] Create `.gitignore`, `.env.example`

### TASK-1.2: Shared Package Setup
- [ ] Create `packages/shared/package.json`
- [ ] Configure `tsconfig.json` for shared types
- [ ] Define shared Zod schemas (auth, snailpay, user)
- [ ] Export snail names, validation constants
- [ ] Build script for shared package

### TASK-1.3: Frontend Setup
- [ ] Create `apps/frontend` with Vite + React + TypeScript
- [ ] Configure `tsconfig.json`, `vite.config.ts`
- [ ] Set up React Router, React Hook Form, Zod
- [ ] Install charting library (Recharts recommended)
- [ ] Configure path aliases (`@/`, `@shared/`)
- [ ] Set up Vitest + React Testing Library

### TASK-1.4: Backend Setup
- [ ] Create `apps/backend` with Express + TypeScript
- [ ] Configure `tsconfig.json`, `tsx` for dev
- [ ] Set up middleware: CORS, Helmet, JSON parser
- [ ] Configure Vitest + Supertest
- [ ] Set up path aliases

---

## Phase 2: Authentication Feature

### TASK-2.1: Backend Auth Implementation
- [ ] Create User model (in-memory Map for demo)
- [ ] Implement password hashing (bcrypt)
- [ ] Create JWT token generation/validation
- [ ] Implement `POST /api/auth/register`
  - [ ] Validate input (Zod)
  - [ ] Check email uniqueness
  - [ ] Hash password
  - [ ] Create user with balance: 0
  - [ ] Return token + user
- [ ] Implement `POST /api/auth/login`
  - [ ] Validate input
  - [ ] Verify password
  - [ ] Return token + user
- [ ] Create auth middleware for protected routes
- [ ] Write unit tests for auth service
- [ ] Write integration tests for auth endpoints

### TASK-2.2: Frontend Auth Implementation
- [ ] Create `AuthContext` with state: user, token, isAuthenticated
- [ ] Implement `useAuth` hook
- [ ] Create `useLocalStorage` hook for persistence
- [ ] Build `LoginForm` with React Hook Form + Zod
- [ ] Build `RegisterForm` with validation
- [ ] Create `AuthLayout` for auth pages
- [ ] Implement `LoginPage` and `RegisterPage`
- [ ] Create protected route wrapper
- [ ] Set up API service with axios/fetch
- [ ] Write component tests for forms
- [ ] Write integration test for auth flow

---

## Phase 3: Dashboard Feature

### TASK-3.1: Dashboard Layout & Components
- [ ] Create `DashboardLayout` with header, sidebar
- [ ] Build `UserHeader` (name, logout button)
- [ ] Build `BalanceCard` (current balance display)
- [ ] Implement responsive grid layout

### TASK-3.2: Charts Implementation
- [ ] Create `BetsDonutChart` (won vs lost bets)
  - [ ] Simulated data generation
  - [ ] Recharts donut configuration
  - [ ] Responsive, accessible
- [ ] Create `SnailVictoriesBarChart`
  - [ ] 6 snails with names
  - [ ] 6 races per day simulation
  - [ ] Bar chart with victories per snail
  - [ ] Consistent simulated data

### TASK-3.3: SnailPay Integration (Frontend)
- [ ] Create `SnailPayModal` component
- [ ] Build payment form with validation
- [ ] Implement `useSnailPay` hook
- [ ] Connect to backend API
- [ ] Handle success: update balance, show toast
- [ ] Handle errors: display user-friendly messages
- [ ] Save fictional card data to localStorage (per requirements)

### TASK-3.4: Dashboard Page Assembly
- [ ] Create `DashboardPage` composing all components
- [ ] Wire up AuthContext for user data
- [ ] Ensure balance updates reactively
- [ ] Write component tests for dashboard
- [ ] Write integration test for SnailPay flow

---

## Phase 4: SnailPay Backend Service

### TASK-4.1: SnailPay Service Implementation
- [ ] Create `SnailPayService` class
- [ ] Implement charge processing logic
- [ ] Define success conditions (exact card match)
- [ ] Implement transaction error scenarios
  - [ ] Invalid card number
  - [ ] Expired card
  - [ ] Invalid CVV
  - [ ] Declined card (specific test numbers)
- [ ] Implement system error simulation
  - [ ] Header-based trigger: `x-snailpay-simulate-error`
  - [ ] Or environment variable
- [ ] Generate proper response format
  - [ ] Unique ID (UUID)
  - [ ] Status: approved/rejected/error
  - [ ] Status detail messages
  - [ ] Authorization code (on success)
  - [ ] Reference number
  - [ ] Payer info

### TASK-4.2: SnailPay API Endpoint
- [ ] Create `POST /api/snailpay/charge` route
- [ ] Add auth middleware
- [ ] Validate request body (Zod)
- [ ] Call SnailPayService
- [ ] Return standardized response
- [ ] Write unit tests for service
- [ ] Write integration tests for endpoint
- [ ] Test all response scenarios

---

## Phase 5: Polish & Testing

### TASK-5.1: End-to-End Testing
- [ ] Full registration → login → dashboard → SnailPay flow
- [ ] Session persistence across reloads
- [ ] Protected route enforcement
- [ ] Error boundary testing

### TASK-5.2: UI/UX Polish
- [ ] Consistent design system (colors, spacing, typography)
- [ ] Loading states for all async operations
- [ ] Error toasts/notifications
- [ ] Form validation feedback
- [ ] Responsive design (mobile, tablet, desktop)
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