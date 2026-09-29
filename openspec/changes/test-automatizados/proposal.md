# Proposal

## Why

The SISU snail racing betting app has all core functionality implemented (auth, dashboard, SnailPay) but lacks automated tests. The requirements specify implementing "pruebas automatizadas acordes con tu nivel actual de conocimiento" and the evaluation considers "qué decidiste probar, por qué lo consideraste importante y tu capacidad para explicar las pruebas implementadas". Tests are needed to validate the auth flow, SnailPay integration, and dashboard components before delivery.

## What Changes

- Add unit tests for backend services (authService, snailPayService, userModel)
- Add integration tests for API endpoints (auth register/login, snailpay charge)
- Add component tests for frontend (LoginForm, RegisterForm, SnailPayModal, DashboardPage)
- Configure Vitest + React Testing Library + Supertest
- Add test scripts to package.json workspaces

## Capabilities

### New Capabilities
- `testing`: Automated test suite covering unit, integration, and component layers

### Modified Capabilities
- (none - no spec-level behavior changes, only test coverage)

## Impact

- **Frontend**: New test files in `apps/frontend/src/**/*.test.tsx`, Vitest config
- **Backend**: New test files in `apps/backend/src/**/*.test.ts`, Vitest + Supertest config
- **Shared**: No changes needed (types already exported)
- **Root**: Test scripts in package.json
- **CI/CD**: Ready for test execution in pipeline