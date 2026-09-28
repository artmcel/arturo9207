import { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AuthLayout({ children, title = 'SISU Carreras de Caracoles' }: AuthLayoutProps) {
  return (
    <div className={styles.authLayout}>
      <header className={styles.authHeader}>
        <h1 className={styles.authLogo}>🐌 {title}</h1>
      </header>
      <main className={styles.authMain}>{children}</main>
      <footer className={styles.authFooter}>
        <p>Prueba técnica SISU Technologies</p>
      </footer>
    </div>
  );
}