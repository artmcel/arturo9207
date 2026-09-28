import { AuthLayout } from '../components/auth';
import { RegisterForm } from '../components/auth';

export function RegisterPage() {
  return (
    <AuthLayout title="Registro - SISU">
      <RegisterForm />
    </AuthLayout>
  );
}