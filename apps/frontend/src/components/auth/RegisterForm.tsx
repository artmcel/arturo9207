import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterRequestSchema, type RegisterRequest } from '@shared/types';
import { Button, Input, Card, CardHeader } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';

export function RegisterForm() {
  const { register } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await register(data);
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      showError(message);
    }
  };

  return (
    <Card className={styles.authCard}>
      <CardHeader title="Crear cuenta" subtitle="Regístrate para empezar a apostar en carreras de caracoles" />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm} noValidate>
        <div className={styles.formGroup}>
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            {...registerField('fullName')}
            error={errors.fullName?.message}
            autoComplete="name"
            required
          />
        </div>
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
            autoComplete="new-password"
            required
            helperText="Mínimo 8 caracteres"
          />
        </div>
        <div className={styles.formGroup}>
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            {...registerField('confirmPassword')}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            required
          />
        </div>
        <Button type="submit" fullWidth loading={isSubmitting} className={styles.submitBtn}>
          Crear cuenta
        </Button>
      </form>
    </Card>
  );
}