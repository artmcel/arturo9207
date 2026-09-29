import { z } from 'zod';
export declare const BetStatsSchema: z.ZodObject<{
    won: z.ZodNumber;
    lost: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    won: number;
    lost: number;
}, {
    won: number;
    lost: number;
}>;
export type BetStats = z.infer<typeof BetStatsSchema>;
export declare const SnailVictorySchema: z.ZodObject<{
    snailId: z.ZodString;
    snailName: z.ZodString;
    victories: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    snailId: string;
    snailName: string;
    victories: number;
}, {
    snailId: string;
    snailName: string;
    victories: number;
}>;
export type SnailVictory = z.infer<typeof SnailVictorySchema>;
export declare const SnailRaceDaySchema: z.ZodObject<{
    date: z.ZodString;
    races: z.ZodArray<z.ZodObject<{
        raceNumber: z.ZodNumber;
        winnerSnailId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        raceNumber: number;
        winnerSnailId: string;
    }, {
        raceNumber: number;
        winnerSnailId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    date: string;
    races: {
        raceNumber: number;
        winnerSnailId: string;
    }[];
}, {
    date: string;
    races: {
        raceNumber: number;
        winnerSnailId: string;
    }[];
}>;
export type SnailRaceDay = z.infer<typeof SnailRaceDaySchema>;
export declare const DashboardDataSchema: z.ZodObject<{
    user: z.ZodObject<{
        fullName: z.ZodString;
        balance: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        fullName: string;
        balance: number;
    }, {
        fullName: string;
        balance: number;
    }>;
    betStats: z.ZodObject<{
        won: z.ZodNumber;
        lost: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        won: number;
        lost: number;
    }, {
        won: number;
        lost: number;
    }>;
    snailVictories: z.ZodArray<z.ZodObject<{
        snailId: z.ZodString;
        snailName: z.ZodString;
        victories: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        snailId: string;
        snailName: string;
        victories: number;
    }, {
        snailId: string;
        snailName: string;
        victories: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    user: {
        fullName: string;
        balance: number;
    };
    betStats: {
        won: number;
        lost: number;
    };
    snailVictories: {
        snailId: string;
        snailName: string;
        victories: number;
    }[];
}, {
    user: {
        fullName: string;
        balance: number;
    };
    betStats: {
        won: number;
        lost: number;
    };
    snailVictories: {
        snailId: string;
        snailName: string;
        victories: number;
    }[];
}>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
//# sourceMappingURL=dashboard.d.ts.map