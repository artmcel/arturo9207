import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../ui';
import { BetStats } from '@shared/types';
import styles from './BetsDonutChart.module.css';

interface BetsDonutChartProps {
  data: BetStats;
  className?: string;
}

const COLORS = ['var(--color-success)', 'var(--color-error)'];

export function BetsDonutChart({ data, className = '' }: BetsDonutChartProps) {
  const chartData = [
    { name: 'Ganadas', value: data.won, color: COLORS[0] },
    { name: 'Perdidas', value: data.lost, color: COLORS[1] },
  ];

  const total = data.won + data.lost;
  const winRate = total > 0 ? Math.round((data.won / total) * 100) : 0;

  return (
    <Card className={`${styles.betsChartCard} ${className}`} padding="md">
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Apuestas</h3>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, 'apuestas']}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingRight: 20 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>{total}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Tasa de acierto</span>
          <span className={styles.summaryValue}>{winRate}%</span>
        </div>
      </div>
    </Card>
  );
}