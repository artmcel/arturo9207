import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Card } from '../ui';
import { SnailVictory } from '@shared/types';
import { SNAILS } from '@shared/constants';
import styles from './SnailVictoriesBarChart.module.css';

interface SnailVictoriesBarChartProps {
  data: SnailVictory[];
  className?: string;
}

const SNAIL_COLORS = [
  '#2E7D32', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
];

export function SnailVictoriesBarChart({ data, className = '' }: SnailVictoriesBarChartProps) {
  const chartData = data.map((item, index) => {
    const snail = SNAILS.find((s) => s.id === item.snailId);
    return {
      name: snail?.name || item.snailName,
      victories: item.victories,
      color: SNAIL_COLORS[index % SNAIL_COLORS.length],
    };
  });

  const maxVictories = Math.max(...chartData.map((d) => d.victories), 1);

  return (
    <Card className={`${styles.snailChartCard} ${className}`} padding="md">
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Victorias por Caracol (Hoy)</h3>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis
              type="number"
              domain={[0, maxVictories + 1]}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: 'var(--color-text-primary)', fontSize: 13, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [value, 'victorias']}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
              }}
            />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" iconSize={8} />
            <Bar
              dataKey="victories"
              name="Victorias"
              radius={[0, 4, 4, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}