import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { renderWithProviders, createMockAuthResponse } from '../../../test-utils';
import { authService } from '../../../services/authService';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: actual.useLocation,
    useParams: actual.useParams,
    Link: actual.Link,
  };
});

vi.mock('../../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders email and password fields and submit button', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
    });
  });

  it('shows validation error for empty fields', async () => {
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });
  });

  it('calls login and navigates on valid submit', async () => {
    const mockUser = createMockAuthResponse();
    (authService.login as any).mockResolvedValue(mockUser);

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error toast on login failure', async () => {
    (authService.login as any).mockRejectedValue(new Error('Credenciales inválidas'));

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });

  it('shows loading state while submitting', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    (authService.login as any).mockReturnValue(loginPromise);

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Iniciar sesión');

    resolveLogin!(createMockAuthResponse());
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});