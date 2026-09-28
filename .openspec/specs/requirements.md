# Requirements Specification

## Project: SISU Snail Racing Betting App

### Functional Requirements

#### FR-1: User Authentication
- **FR-1.1**: User registration with full name, email, password, password confirmation
- **FR-1.2**: Form validation (required fields, email format, password match, password strength)
- **FR-1.3**: User login with email and password
- **FR-1.4**: User logout
- **FR-1.5**: Session persistence via localStorage (survives page reload)
- **FR-1.6**: Protected dashboard route (requires active session)
- **FR-1.7**: Initial user balance: $0
- **FR-1.8**: Password handling (hashing/simulation) - part of evaluation

#### FR-2: Dashboard
- **FR-2.1**: Display registered user's full name
- **FR-2.2**: Display current balance
- **FR-2.3**: Donut chart showing won vs lost bets (simulated data)
- **FR-2.4**: Bar chart showing snail victories per day (6 snails, 6 races/day, simulated)
- **FR-2.5**: SnailPay balance top-up option
- **FR-2.6**: Logout button
- **FR-2.7**: Simulated betting/race data (no actual betting logic needed)

#### FR-3: SnailPay Integration (Backend Service)
- **FR-3.1**: Mock payment gateway endpoint (`POST /api/snailpay/charge`)
- **FR-3.2**: Accept: card number, expiry, CVV, full name, amount, user ID, user email
- **FR-3.3**: Success case: card `1234123412341234`, expiry `12/26`, CVV `543`, any non-empty name, amount > 0
- **FR-3.4**: On success: increase balance, persist to localStorage, update dashboard, show approval message
- **FR-3.5**: Transaction error simulation (invalid data, declined card, etc.)
- **FR-3.6**: System error simulation (SnailPay internal failure)
- **FR-3.7**: Response format with fields: id, status, status_detail, transaction_amount, date_created, authorization_code, reference, payer_id, payer_email
- **FR-3.8**: On failure: no balance change, clear error message, no false success
- **FR-3.9**: Card number and CVV included in responses, saved to localStorage (fictional data only)

### Non-Functional Requirements
- **NFR-1**: React + TypeScript frontend
- **NFR-2**: Express + TypeScript backend
- **NFR-3**: localStorage for persistence
- **NFR-4**: Clean architecture, separation of concerns
- **NFR-5**: Type safety across frontend/backend
- **NFR-6**: Automated tests (unit/integration)
- **NFR-7**: Clear, consistent, usable UI
- **NFR-8**: Documentation for running app and tests
- **NFR-9**: Git repository with conventional naming

### Optional Enhancements
- **OPT-1**: Deployed application with public URL
- **OPT-2**: Database design proposal (no implementation required)