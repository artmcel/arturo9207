# AGENTS.md - SISU Snail Racing Betting App

## Project Overview
Full-stack snail racing betting app with React + Express + TypeScript. LocalStorage for persistence. Mock payment gateway (SnailPay).

## Stack
- Frontend: React 18, TypeScript, Vite
- Backend: Express, TypeScript
- Charts: Chart.js (lightweight, no heavy deps)
- Styling: Plain CSS Modules (zero runtime)
- Testing: Vitest + React Testing Library

## Commands
```bash
# Install
npm install

# Dev (both)
npm run dev

# Frontend only
npm run dev:client

# Backend only
npm run dev:server

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## Architecture
```
/client          # React app
  /src
    /components  # UI components
    /hooks       # Custom hooks (auth, snailpay)
    /pages       # Page components
    /services    # API clients
    /types       # Shared types
    /utils       # Helpers
/server          # Express API
  /src
    /routes      # API routes
    /services    # Business logic (SnailPay)
    /types       # Shared types
```

## Key Decisions
- **Auth**: JWT in localStorage (httpOnly cookie not needed for local mock)
- **Passwords**: bcryptjs hashing (never plain text)
- **SnailPay**: Deterministic mock - specific card = success, "ERROR" in name = system error, else = transaction error
- **Charts**: Static simulated data (6 snails, 6 races/day)
- **State**: React Context for auth, localStorage sync via custom hook

## SnailPay Test Cards
| Scenario | Card | Expiry | CVV | Name | Amount |
|----------|------|--------|-----|------|--------|
| Success | 1234123412341234 | 12/26 | 543 | Any non-empty | > 0 |
| System Error | Any | Any | Any | Contains "ERROR" | Any |
| Transaction Error | Any other | Any | Any | Any | Any |

## Response Format (all scenarios)
```typescript
interface SnailPayResponse {
  id: string;
  status: 'approved' | 'rejected' | 'error';
  status_detail: string;
  transaction_amount: number;
  date_created: string; // ISO
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
}
```

## Testing Strategy
- Unit: SnailPay service logic (all 3 paths)
- Integration: Auth flow (register → login → persist → logout)
- Component: Dashboard renders with mocked data
- E2E: Not required (local mock only)

## Security Notes
- Passwords hashed before localStorage
- No real card data stored (only masked in responses)
- CORS restricted to localhost:5173
- Input validation on both ends

## What to Skip (YAGNI)
- Password reset, email verification
- Multi-user admin
- Real payment integration
- Database (localStorage only)
- WebSocket/real-time
- Complex routing (3 pages max)

## Ponytail Debt
- `ponytail: localStorage sync on every render` → use useEffect with deps when perf matters
- `ponytail: inline styles in charts` → extract to theme if design system grows