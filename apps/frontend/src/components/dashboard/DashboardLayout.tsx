import { ReactNode } from 'react';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardLayout}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>🐌 SISU Dashboard</h1>
        </div>
      </header>
      <main className={styles.dashboardMain}>{children}</main>
    </div>
  );
}