# Snail Racing Betting App

Aplicación web de apuestas en carreras de caracoles construida con React + Express + TypeScript.

## Arquitectura

Monorepo con estructura spec-driven development:

```
sisu2/
├── apps/
│   ├── frontend/          # React 18 + TypeScript + Vite
│   └── backend/           # Express + TypeScript
├── packages/
│   └── shared/            # Tipos, constantes y utilidades compartidas
├── .openspec/
│   └── specs/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
```

## Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm 10+

### Instalación
```bash
# Instalar dependencias de todos los workspaces
npm install

# Construir paquete compartido
npm run build --workspace=packages/shared

# Desarrollo (frontend + backend)
npm run dev
```

### URLs de Desarrollo
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Frontend + Backend concurrentemente
npm run dev:frontend        # Solo frontend (puerto 3000)
npm run dev:backend         # Solo backend (puerto 3001)

# Build
npm run build               # Build all workspaces
npm run build:frontend      # Build frontend
npm run build:backend       # Build backend

# Testing
npm run test                # Tests all workspaces
npm run test:frontend       # Tests frontend
npm run test:backend        # Tests backend

# Linting & Typecheck
npm run lint                # ESLint all workspaces
npm run typecheck           # TypeScript check all workspaces
```

## SnailPay - Tarjetas de Prueba

### Cobro Exitoso
```
Número: 1234123412341234
Expiración: 12/26
CVV: 543
Nombre: Cualquier valor no vacío
Monto: > 0
```

### Tarjetas Rechazadas
```
4000000000000002  - Declinada
4000000000000069  - Expirada
4000000000000127  - CVV incorrecto
```

### Error del Sistema
Enviar header: `x-snailpay-simulate-error: true`
O configurar variable de entorno: `SNAILPAY_SIMULATE_SYSTEM_ERROR=true`

## Funcionalidades

### Autenticación
- Registro con validación (nombre, email, contraseña, confirmación)
- Login con email y contraseña
- Persistencia de sesión en localStorage
- Rutas protegidas (dashboard)

### Dashboard
- Nombre de usuario y saldo
- Gráfico donut: apuestas ganadas vs perdidas
- Gráfico de barras: victorias por caracol (6 caracoles, 6 carreras/día)
- Recarga de saldo con SnailPay
- Cerrar sesión

### SnailPay (Backend)
- Endpoint POST `/api/snailpay/charge`
- Respuestas tipadas: id, status, status_detail, transaction_amount, date_created, authorization_code, reference, payer_id, payer_email
- Simulación de: éxito, error transacción, error sistema

## Configuración

### Variables de Entorno

**Backend** (`.env` en `apps/backend/`):
```env
PORT=3001
JWT_SECRET=tu-secreto-super-seguro
FRONTEND_URL=http://localhost:3000
SNAILPAY_SIMULATE_SYSTEM_ERROR=false
```

**Frontend** (`.env` en `apps/frontend/`):
```env
VITE_API_URL=http://localhost:3001/api
```

## Testing

```bash
# Frontend tests
cd apps/frontend && npm run test

# Backend tests
cd apps/backend && npm run test

# Shared package tests
cd packages/shared && npm run test
```

## Estructura de Carpetas

### Frontend (`apps/frontend/src/`)
```
├── components/
│   ├── ui/              # Button, Input, Card, Modal, Toast, Spinner
│   ├── auth/            # LoginForm, RegisterForm, ProtectedRoute
│   └── dashboard/       # BalanceCard, Charts, SnailPayModal
├── contexts/            # AuthContext
├── hooks/               # useAuth, useLocalStorage, useSnailPay
├── pages/               # LoginPage, RegisterPage, DashboardPage
├── services/            # api, authService, snailPayService
├── types/               # Types locales
└── utils/               # Utilidades
```

### Backend (`apps/backend/src/`)
```
├── routes/              # auth, snailpay
├── controllers/         # authController, snailPayController
├── services/            # authService, snailPayService
├── middleware/          # auth, validation, errorHandler
├── models/              # user (in-memory)
├── utils/               # password, jwt, responses
└── types/               # express.d.ts
```

### Shared (`packages/shared/src/`)
```
├── types/               # user, snailpay, dashboard, api
├── constants/           # snailpay, validation, snails
└── utils/               # formatters, validation
```

## Decisiones de Diseño

1. **Monorepo con npm workspaces**: Compartir tipos entre frontend/backend
2. **In-memory user store**: Simplicidad para demo (localStorage en frontend)
3. **JWT simple**: Sin refresh tokens para mantener simplicidad
4. **Recharts**: Gráficos ligeros y declarativos
5. **React Hook Form + Zod**: Validación robusta tipo-segura
6. **CSS-in-JS (styled-jsx)**: Estilos scoped sin dependencias extra

## Seguridad

- Contraseñas hasheadas con bcrypt (12 rounds)
- Validación Zod en cliente y servidor
- Helmet.js en Express
- CORS configurado
- Sanitización de inputs
