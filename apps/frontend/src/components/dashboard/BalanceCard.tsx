import { formatCurrency } from '@shared/utils';
import { Card } from '../ui';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
  balance: number;
  className?: string;
}

export function BalanceCard({ balance, className = '' }: BalanceCardProps) {
  return (
    <Card className={`${styles.balanceCard} ${className}`} padding="lg">
      <div className={styles.balanceContent}>
        <div className={styles.balanceInfo}>
          <p className={styles.balanceLabel}>Saldo actual</p>
          <p className={styles.balanceAmount}>{formatCurrency(balance)}</p>
        </div>
        <div className={styles.balanceIcon} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="6" y1="14" x2="6.01" y2="14" />
            <line x1="10" y1="14" x2="10.01" y2="14" />
            <line x1="14" y1="14" x2="14.01" y2="14" />
            <line x1="18" y1="14" x2="18.01" y2="14" />
          </svg>
        </div>
      </div>
    </Card>
  );
}