import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorMessage({ message, onRetry, retryText = 'Reintentar', className = '' }: ErrorMessageProps) {
  return (
    <div className={`${styles.errorMessage} ${className}`} role="alert">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          {retryText}
        </button>
      )}
    </div>
  );
}