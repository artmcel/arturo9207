# PRD - SISU Snail Racing Betting App

## Product Vision
A lightweight full-stack web application simulating snail racing bets with user authentication, dashboard analytics, and a mock payment gateway (SnailPay).

## Target Users
- Developer candidates demonstrating full-stack capabilities
- Evaluators assessing code organization, TypeScript usage, and integration patterns

## Core Features

### 1. Authentication (Local Mock)
- **Register**: Full name, email, password, password confirmation
- **Login**: Email + password
- **Logout**: Clear session
- **Persistence**: JWT + user data in localStorage survives reload
- **Route Protection**: Dashboard only accessible with active session
- **Initial Balance**: $0

### 2. Dashboard
- User name display
- Current balance
- Donut chart: Won vs Lost bets (simulated)
- Bar chart: 6 snails × 6 races/day victories (simulated)
- SnailPay recharge button
- Logout button

### 3. SnailPay Integration (Express Mock)
**Endpoint**: `POST /api/snailpay/charge`

**Request**:
```typescript
{
  cardNumber: string;
  expiry: string;      // MM/YY
  cvv: string;
  cardholderName: string;
  amount: number;
  userId: string;
  userEmail: string;
}
```

**Deterministic Responses**:
| Scenario | Trigger | Outcome |
|----------|---------|---------|
| Success | Card: `1234123412341234`, Expiry: `12/26`, CVV: `543`, Name: non-empty, Amount: > 0 | Balance +amount, status: `approved` |
| System Error | Cardholder name contains "ERROR" | status: `error`, no balance change |
| Transaction Error | Any other valid input | status: `rejected`, no balance change |

**Response Format** (all scenarios):
```typescript
{
  id: string;
  status: 'approved' | 'rejected' | 'error';
  status_detail: string;
  transaction_amount: number;
  date_created: string; // ISO 8601
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
}
```

## Non-Functional Requirements
- **Stack**: React 18 + Express + TypeScript (both ends)
- **Persistence**: localStorage only (no database)
- **Security**: bcryptjs for passwords, CORS localhost:5173
- **Charts**: Any library (Chart.js recommended)
- **Testing**: Unit + Integration + Component (Vitest + RTL)
- **No**: Password reset, email verification, admin, real payments, WebSockets

## Acceptance Criteria
1. Register → Login → Dashboard accessible
2. Reload preserves session and balance
3. SnailPay success increases balance immediately
4. SnailPay errors show clear messages, no balance change
5. All 3 SnailPay scenarios reproducible via documented test cards
6. Dashboard charts render with simulated but consistent data

## Out of Scope
- Bet placement / race execution logic
- Multi-user management
- Production deployment (optional bonus)
- Database design (optional bonus)