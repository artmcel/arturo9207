import { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.base} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${disabled || loading ? styles.disabled : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';