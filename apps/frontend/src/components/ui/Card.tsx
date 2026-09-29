import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: '',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`} style={{ padding: paddingStyles[padding] }}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.cardAction}>{action}</div>}
    </div>
  );
}