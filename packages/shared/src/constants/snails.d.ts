export declare const SNAILS: readonly [{
    readonly id: "snail-1";
    readonly name: "Speedy";
}, {
    readonly id: "snail-2";
    readonly name: "Turbo";
}, {
    readonly id: "snail-3";
    readonly name: "Rocket";
}, {
    readonly id: "snail-4";
    readonly name: "Flash";
}, {
    readonly id: "snail-5";
    readonly name: "Bolt";
}, {
    readonly id: "snail-6";
    readonly name: "Zoom";
}];
export declare const RACES_PER_DAY = 6;
export declare function generateDailyRaceResults(_date?: Date): Array<{
    raceNumber: number;
    winnerSnailId: string;
}>;
export declare function calculateVictories(raceResults: Array<{
    winnerSnailId: string;
}>): Record<string, number>;
//# sourceMappingURL=snails.d.ts.map