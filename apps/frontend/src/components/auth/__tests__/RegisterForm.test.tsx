import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
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

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders all fields and submit button', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contraseña\*?$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<RegisterForm />);

    const fullNameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await userEvent.type(fullNameInput, 'Test User');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    renderWithProviders(<RegisterForm />);

    const fullNameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await userEvent.type(fullNameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'short');
    await userEvent.type(confirmPasswordInput, 'short');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('shows validation error for password mismatch', async () => {
    renderWithProviders(<RegisterForm />);

    const fullNameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await userEvent.type(fullNameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'different');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('shows validation error for empty fields', async () => {
    renderWithProviders(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('calls register and navigates on valid submit', async () => {
    const mockUser = createMockAuthResponse();
    (authService.register as any).mockResolvedValue(mockUser);

    renderWithProviders(<RegisterForm />);

    const fullNameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await userEvent.type(fullNameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error toast on register failure', async () => {
    (authService.register as any).mockRejectedValue(new Error('El correo electrónico ya está registrado'));

    renderWithProviders(<RegisterForm />);

    const fullNameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await userEvent.type(fullNameInput, 'Test User');
    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El correo electrónico ya está registrado')).toBeInTheDocument();
    });
  });

  it('shows loading state while submitting', async () => {
    let resolveRegister: (value: any) => void;
    const registerPromise = new Promise((resolve) => {
      resolveRegister = resolve;
    });
    (authService.register as any).mockReturnValue(registerPromise);

    renderWithProviders(<RegisterForm />);

    const fullNameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await userEvent.type(fullNameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Crear cuenta');

    resolveRegister!(createMockAuthResponse());
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});