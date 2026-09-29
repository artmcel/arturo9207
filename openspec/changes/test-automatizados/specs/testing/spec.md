# Spec Delta

## Purpose

Provides automated test coverage for the SISU application to validate authentication flows, SnailPay integration, and dashboard components, ensuring the system behaves correctly across all supported scenarios.

## ADDED Requirements

### Requirement: Unit tests for backend services
The system SHALL provide unit tests for all backend service classes with isolated mocking of dependencies.

#### Scenario: Auth service register
- **WHEN** calling authService.register with valid data
- **THEN** returns user with balance 0 and JWT token
- **AND** password is hashed with bcrypt
- **AND** email uniqueness is enforced

#### Scenario: Auth service login
- **WHEN** calling authService.login with valid credentials
- **THEN** returns user and JWT token
- **WHEN** calling authService.login with invalid password
- **THEN** throws "Credenciales inválidas" error

#### Scenario: SnailPay service charge success
- **WHEN** calling snailPayService.charge with exact success card (1234123412341234, 12/26, 543, any name, amount > 0)
- **THEN** returns status "approved" with all 8 required response fields

#### Scenario: SnailPay service charge transaction error
- **WHEN** calling snailPayService.charge with any other valid card
- **THEN** returns status "rejected" with status_detail explaining rejection

#### Scenario: SnailPay service charge system error
- **WHEN** calling snailPayService.charge with cardholder name containing "ERROR"
- **THEN** returns status "error" with status_detail "Error del sistema"
- **WHEN** calling snailPayService.charge with header x-snailpay-simulate-error: true
- **THEN** returns status "error" with status_detail "Error del sistema"

#### Scenario: User model CRUD
- **WHEN** userModel.create with new user
- **THEN** user stored and retrievable by email and ID
- **WHEN** userModel.updateBalance with valid userId and amount
- **THEN** balance updated and returned
- **WHEN** userModel.toPublic called
- **THEN** returns user without passwordHash

### Requirement: Integration tests for API endpoints
The system SHALL provide integration tests for all HTTP endpoints using Supertest.

#### Scenario: POST /api/auth/register
- **WHEN** POST valid register data
- **THEN** returns 201 with user and token
- **AND** password not in response
- **WHEN** POST duplicate email
- **THEN** returns 400 with REGISTRATION_ERROR
- **WHEN** POST invalid email
- **THEN** returns 400 with validation error

#### Scenario: POST /api/auth/login
- **WHEN** POST valid credentials
- **THEN** returns 200 with user and token
- **WHEN** POST invalid password
- **THEN** returns 401 with LOGIN_ERROR

#### Scenario: GET /api/auth/me
- **WHEN** GET with valid Authorization header
- **THEN** returns 200 with user data
- **WHEN** GET without Authorization header
- **THEN** returns 401

#### Scenario: POST /api/snailpay/charge
- **WHEN** POST success card with auth token
- **THEN** returns 200 with approved response
- **AND** user balance updated in backend
- **WHEN** POST rejected card with auth token
- **THEN** returns 200 with rejected response
- **AND** user balance unchanged
- **WHEN** POST with system error simulation
- **THEN** returns 200 with error response
- **AND** user balance unchanged

### Requirement: Component tests for frontend
The system SHALL provide component tests for all interactive frontend components using Vitest + React Testing Library.

#### Scenario: LoginForm
- **WHEN** rendering LoginForm
- **THEN** shows email, password fields and submit button
- **WHEN** submitting valid form
- **THEN** calls authService.login and navigates to dashboard
- **WHEN** submitting invalid email
- **THEN** shows Zod validation error

#### Scenario: RegisterForm
- **WHEN** rendering RegisterForm
- **THEN** shows fullName, email, password, confirmPassword fields
- **WHEN** submitting valid form
- **THEN** calls authService.register and navigates to dashboard
- **WHEN** passwords don't match
- **THEN** shows "Las contraseñas no coinciden" error

#### Scenario: SnailPayModal
- **WHEN** rendering SnailPayModal open
- **THEN** shows card form with all required fields
- **WHEN** submitting success card data
- **THEN** calls snailPayService.charge
- **AND** shows success toast with new balance
- **AND** calls updateBalance with new amount
- **AND** closes modal
- **WHEN** submitting rejected card data
- **THEN** shows error toast with status_detail

#### Scenario: DashboardPage
- **WHEN** rendering DashboardPage with authenticated user
- **THEN** shows user name, balance, both charts, SnailPay button, logout
- **WHEN** clicking logout
- **THEN** clears auth and navigates to login
- **WHEN** balance updates via updateBalance
- **THEN** BalanceCard re-renders with new value