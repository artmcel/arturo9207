# Design Specification

## Architecture Overview

### Monorepo Structure
```
sisu2/
├── apps/
│   ├── frontend/          # React + TypeScript + Vite
│   └── backend/           # Express + TypeScript
├── packages/
│   └── shared/            # Shared types, constants, utilities
├── .openspec/
│   └── specs/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
└── package.json           # Root workspace config
```

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, React Router v6, Chart.js/Recharts, React Hook Form + Zod
- **Backend**: Express 4, TypeScript, tsx for dev, Vitest for testing
- **Shared**: TypeScript types, Zod schemas, constants
- **Build**: Turbo/Nx or npm workspaces
- **Testing**: Vitest + React Testing Library (frontend), Vitest + Supertest (backend)

---

## Frontend Architecture

### Component Structure
```
apps/frontend/src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthLayout.tsx
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── BetsDonutChart.tsx
│   │   ├── SnailVictoriesBarChart.tsx
│   │   ├── SnailPayModal.tsx
│   │   └── UserHeader.tsx
│   └── common/
│       ├── ErrorMessage.tsx
│       └── LoadingState.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── contexts/
│   └── AuthContext.tsx        # Auth state + localStorage sync
├── hooks/
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── useSnailPay.ts
├── services/
│   ├── api.ts                 # Axios/fetch wrapper
│   ├── authService.ts
│   └── snailPayService.ts
├── types/
│   ├── user.ts
│   ├── auth.ts
│   ├── dashboard.ts
│   └── snailpay.ts
├── utils/
│   ├── validation.ts
│   ├── storage.ts
│   └── formatters.ts
├── routes/
│   └── AppRoutes.tsx
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

### State Management
- **AuthContext**: Global auth state (user, token, isAuthenticated)
- **localStorage sync**: Custom hook `useLocalStorage` for persistence
- **React Query / SWR**: Server state for SnailPay (optional, can use useEffect)
- **Form state**: React Hook Form + Zod validation

### Routing
- `/login` - Public, redirects to `/dashboard` if authenticated
- `/register` - Public, redirects to `/dashboard` if authenticated
- `/dashboard` - Protected, redirects to `/login` if not authenticated
- `/` - Redirects to `/dashboard` or `/login` based on auth

---

## Backend Architecture

### Project Structure
```
apps/backend/src/
├── routes/
│   ├── auth.ts              # POST /register, POST /login
│   └── snailpay.ts          # POST /charge
├── controllers/
│   ├── authController.ts
│   └── snailPayController.ts
├── services/
│   ├── authService.ts       # User registration, login, password hashing
│   └── snailPayService.ts   # Payment processing logic
├── middleware/
│   ├── auth.ts              # JWT/session validation
│   ├── validation.ts        # Zod schema validation
│   └── errorHandler.ts
├── models/
│   └── user.ts              # User entity (in-memory for demo)
├── utils/
│   ├── password.ts          # bcrypt/hash utilities
│   ├── jwt.ts               # Token generation/validation
│   └── responses.ts         # Standardized API responses
├── types/
│   ├── express.d.ts         # Extend Express types
│   ├── auth.ts
│   └── snailpay.ts
├── app.ts                   # Express app setup
└── server.ts                # Entry point
```

### API Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

#### SnailPay
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/snailpay/charge` | Process payment |

### Data Models

#### User (in-memory store for demo)
```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  balance: number;
  createdAt: Date;
}
```

#### SnailPay Request
```typescript
interface SnailPayChargeRequest {
  cardNumber: string;
  expiry: string;      // MM/YY
  cvv: string;
  fullName: string;
  amount: number;
  userId: string;
  userEmail: string;
}
```

#### SnailPay Response
```typescript
interface SnailPayResponse {
  id: string;
  status: 'approved' | 'rejected' | 'error';
  status_detail: string;
  transaction_amount: number;
  date_created: string;  // ISO 8601
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
}
```

### SnailPay Business Logic

#### Success Conditions
- Card: `1234123412341234`
- Expiry: `12/26`
- CVV: `543`
- Full name: non-empty
- Amount: > 0

#### Error Scenarios
1. **Invalid card data**: Wrong card number, expired date, invalid CVV
2. **Declined card**: Specific test card numbers
3. **System error**: Header `x-snailpay-simulate-error: true` or env flag

---

## Shared Package

### Types (`packages/shared/src/types/`)
- `user.ts` - User, AuthResponse
- `snailpay.ts` - SnailPayRequest, SnailPayResponse
- `dashboard.ts` - Chart data types
- `api.ts` - Generic API response wrapper

### Constants (`packages/shared/src/constants/`)
- `snailpay.ts` - Test card numbers, error codes
- `validation.ts` - Regex patterns, min/max values
- `snails.ts` - 6 snail names, race config

### Utilities (`packages/shared/src/utils/`)
- `formatters.ts` - Currency, date formatting
- `validation.ts` - Shared Zod schemas

---

## Data Flow

### Registration Flow
```
User fills RegisterForm
    → Zod validation (client)
    → POST /api/auth/register
    → Backend: hash password, create user, return token
    → Frontend: save to AuthContext + localStorage
    → Redirect to /dashboard
```

### Login Flow
```
User fills LoginForm
    → Zod validation (client)
    → POST /api/auth/login
    → Backend: verify password, return token
    → Frontend: save to AuthContext + localStorage
    → Redirect to /dashboard
```

### SnailPay Flow
```
User opens SnailPayModal
    → Fills payment form
    → Zod validation (client)
    → POST /api/snailpay/charge (with auth token)
    → Backend: process payment logic
    → Returns SnailPayResponse
    → Frontend: on success, update balance in AuthContext + localStorage
    → Show success/error toast
    → Close modal, refresh dashboard
```

---

## Security Considerations
- Password hashing with bcrypt (backend)
- JWT tokens with short expiry + refresh (or simple session simulation)
- Input validation on both client and server (Zod)
- No sensitive data in localStorage (only token, user info, fictional card data)
- CORS configured for frontend origin
- Helmet.js for Express security headers

---

## Testing Strategy

### Frontend
- Unit tests: utils, hooks, validation
- Component tests: forms, charts, modals
- Integration tests: auth flow, SnailPay flow

### Backend
- Unit tests: services, utils
- Integration tests: API endpoints with Supertest
- Contract tests: SnailPay response format

### Shared
- Type tests: ensure type compatibility
- Schema tests: Zod validation behavior