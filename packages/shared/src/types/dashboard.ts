import { z } from 'zod';

export const BetStatsSchema = z.object({
  won: z.number().int().nonnegative(),
  lost: z.number().int().nonnegative(),
});

export type BetStats = z.infer<typeof BetStatsSchema>;

export const SnailVictorySchema = z.object({
  snailId: z.string(),
  snailName: z.string(),
  victories: z.number().int().nonnegative(),
});

export type SnailVictory = z.infer<typeof SnailVictorySchema>;

export const SnailRaceDaySchema = z.object({
  date: z.string().date(),
  races: z.array(z.object({
    raceNumber: z.number().int().positive(),
    winnerSnailId: z.string(),
  })),
});

export type SnailRaceDay = z.infer<typeof SnailRaceDaySchema>;

export const DashboardDataSchema = z.object({
  user: z.object({
    fullName: z.string(),
    balance: z.number().nonnegative(),
  }),
  betStats: BetStatsSchema,
  snailVictories: z.array(SnailVictorySchema),
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;