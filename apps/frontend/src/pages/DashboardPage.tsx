import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout, BalanceCard, BetsDonutChart, SnailVictoriesBarChart, UserHeader, SnailPayModal } from '../components/dashboard';
import { generateDailyRaceResults, calculateVictories, SNAILS } from '@shared/constants';
import { BetStats, SnailVictory } from '@shared/types';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user } = useAuth();
  const [snailPayOpen, setSnailPayOpen] = useState(false);
  const [betStats, setBetStats] = useState<BetStats>({ won: 0, lost: 0 });
  const [snailVictories, setSnailVictories] = useState<SnailVictory[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const betsKey = `sisu_bets_${user.id}`;
    const victoriesKey = `sisu_victories_${user.id}`;
    const savedBets = localStorage.getItem(betsKey);
    const savedVictories = localStorage.getItem(victoriesKey);

    if (savedBets && savedVictories) {
      try {
        setBetStats(JSON.parse(savedBets));
        setSnailVictories(JSON.parse(savedVictories));
      } catch {
        generateMockData();
      }
    } else {
      generateMockData();
    }
  }, [user?.id]);

  const generateMockData = () => {
    if (!user?.id) return;
    const won = Math.floor(Math.random() * 20) + 5;
    const lost = Math.floor(Math.random() * 15) + 3;
    const stats = { won, lost };
    setBetStats(stats);
    localStorage.setItem(`sisu_bets_${user.id}`, JSON.stringify(stats));

    const raceResults = generateDailyRaceResults();
    const victories = calculateVictories(raceResults);
    const victoryData: SnailVictory[] = SNAILS.map((snail) => ({
      snailId: snail.id,
      snailName: snail.name,
      victories: victories[snail.id] || 0,
    }));
    setSnailVictories(victoryData);
    localStorage.setItem(`sisu_victories_${user.id}`, JSON.stringify(victoryData));
  };

  return (
    <DashboardLayout>
      <UserHeader />
      <div className={styles.dashboardGrid}>
        <BalanceCard balance={user?.balance || 0} />
        <BetsDonutChart data={betStats} />
        <SnailVictoriesBarChart data={snailVictories} />
      </div>
      <div className={styles.snailpaySection}>
        <button className={styles.snailpayBtn} onClick={() => setSnailPayOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Recargar saldo con SnailPay
        </button>
      </div>
      <SnailPayModal isOpen={snailPayOpen} onClose={() => setSnailPayOpen(false)} />
    </DashboardLayout>
  );
}