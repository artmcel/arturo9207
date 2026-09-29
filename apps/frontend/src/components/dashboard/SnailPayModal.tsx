import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SnailPayChargeRequestSchema, type SnailPayChargeRequest } from '@shared/types';
import { useAuth } from '../../contexts/AuthContext';
import { snailPayService } from '../../services/snailPayService';
import { Modal, Button, Input, Card } from '../ui';
import { useToast } from '../ui/Toast';
import { formatCurrency } from '@shared/utils';
import styles from './SnailPayModal.module.css';

interface SnailPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SnailPayModal({ isOpen, onClose }: SnailPayModalProps) {
  const { user, updateBalance } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SnailPayChargeRequest>({
    resolver: zodResolver(SnailPayChargeRequestSchema),
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      fullName: '',
      amount: 0,
      userId: user?.id || '',
      userEmail: user?.email || '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SnailPayChargeRequest) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await snailPayService.charge(data);
      if (response.status === 'approved') {
        const newBalance = user.balance + data.amount;
        updateBalance(newBalance);
        showSuccess(`Recarga de ${formatCurrency(data.amount)} aprobada. Nuevo saldo: ${formatCurrency(newBalance)}`);
        reset();
        onClose();
      } else {
        showError(response.status_detail || 'Error en la transacción');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar el pago';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recargar saldo con SnailPay" size="md">
      <Card className={styles.snailpayCard} padding="md">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.snailpayForm} noValidate>
          <div className={styles.formRow}>
            <Input
              label="Número de tarjeta"
              placeholder="1234 1234 1234 1234"
              {...register('cardNumber')}
              error={errors.cardNumber?.message}
              autoComplete="cc-number"
              inputMode="numeric"
              maxLength={19}
              required
            />
          </div>
          <div className={`${styles.formRow} ${styles.twoCols}`}>
            <Input
              label="Fecha de vencimiento (MM/YY)"
              placeholder="12/26"
              {...register('expiry')}
              error={errors.expiry?.message}
              autoComplete="cc-exp"
              maxLength={5}
              required
            />
            <Input
              label="CVV"
              placeholder="543"
              type="password"
              {...register('cvv')}
              error={errors.cvv?.message}
              autoComplete="cc-csc"
              inputMode="numeric"
              maxLength={3}
              required
            />
          </div>
          <div className={styles.formRow}>
            <Input
              label="Nombre en la tarjeta"
              placeholder="JUAN PEREZ"
              {...register('fullName')}
              error={errors.fullName?.message}
              autoComplete="cc-name"
              required
            />
          </div>
          <div className={styles.formRow}>
            <Input
              label="Monto a recargar"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="10.00"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
              required
            />
          </div>
          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Pagar {formatCurrency(watch('amount') || 0)}
            </Button>
          </div>
        </form>
        <div className={styles.testCards}>
          <p className={styles.testCardsTitle}>Tarjeta de prueba (éxito):</p>
          <div className={styles.testCardInfo}>
            <code>1234 1234 1234 1234</code>
            <span>/</span>
            <code>12/26</code>
            <span>/</span>
            <code>543</code>
            <span>/</span>
            <code>Cualquier nombre</code>
          </div>
        </div>
      </Card>
    </Modal>
  );
}