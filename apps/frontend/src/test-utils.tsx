import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { vi } from 'vitest';

// Mock react-router-dom to include MemoryRouter
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: actual.useLocation,
    useParams: actual.useParams,
    Link: actual.Link,
  };
});

// Test user factory
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  fullName: 'Test User',
  email: 'test@example.com',
  balance: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockAuthResponse = (overrides = {}) => ({
  user: createMockUser(),
  token: 'mock-jwt-token',
  ...overrides,
});

export const createMockSnailPayResponse = (overrides = {}) => ({
  id: 'mock-transaction-id',
  status: 'approved',
  status_detail: 'Operación aprobada',
  transaction_amount: 100,
  date_created: new Date().toISOString(),
  authorization_code: 'AUTH123',
  reference: 'SNL-123456',
  payer_id: 'test-user-id',
  payer_email: 'test@example.com',
  ...overrides,
});

// Custom render with providers
interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuth?: {
    user: ReturnType<typeof createMockUser> | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  route?: string;
}

const defaultAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateBalance: vi.fn(),
  refreshUser: vi.fn(),
};

export function renderWithProviders(
  ui: ReactNode,
  options: RenderWithProvidersOptions = {}
) {
  const { initialAuth, route = '/', ...renderOptions } = options;

  const authState = {
    ...defaultAuthState,
    ...initialAuth,
  };

  // Create a wrapper that provides all necessary contexts
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );
  }

  const { result } = render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  return result;
}

// Helper to get auth context in tests
export function useTestAuth() {
  return useAuth();
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { vi, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';