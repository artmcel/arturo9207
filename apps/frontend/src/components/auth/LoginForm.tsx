import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema, type LoginRequest } from '@shared/types';
import { Button, Input, Card, CardHeader } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      showError(message);
    }
  };

  return (
    <Card className={styles.authCard}>
      <CardHeader title="Iniciar sesión" subtitle="Accede a tu cuenta de apuestas de caracoles" />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm} noValidate>
        <div className={styles.formGroup}>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="juan@ejemplo.com"
            {...registerField('email')}
            error={errors.email?.message}
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...registerField('password')}
            error={errors.password?.message}
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" fullWidth loading={isSubmitting} className={styles.submitBtn}>
          Iniciar sesión
        </Button>
      </form>
      <p className={styles.registerLink}>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </Card>
  );
}