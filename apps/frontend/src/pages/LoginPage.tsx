import { AuthLayout } from '../components/auth';
import { LoginForm } from '../components/auth';

export function LoginPage() {
  return (
    <AuthLayout title="Login - SISU">
      <LoginForm />
    </AuthLayout>
  );
}