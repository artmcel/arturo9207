import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import styles from './UserHeader.module.css';

export function UserHeader() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.userHeader}>
      <div className={styles.userInfo}>
        <div className={styles.userAvatar} aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>{user?.fullName}</p>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </Button>
    </div>
  );
}