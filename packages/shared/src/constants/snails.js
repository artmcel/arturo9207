export const SNAILS = [
    { id: 'snail-1', name: 'Speedy' },
    { id: 'snail-2', name: 'Turbo' },
    { id: 'snail-3', name: 'Rocket' },
    { id: 'snail-4', name: 'Flash' },
    { id: 'snail-5', name: 'Bolt' },
    { id: 'snail-6', name: 'Zoom' },
];
export const RACES_PER_DAY = 6;
export function generateDailyRaceResults(_date = new Date()) {
    const results = [];
    for (let i = 1; i <= RACES_PER_DAY; i++) {
        const randomIndex = Math.floor(Math.random() * SNAILS.length);
        results.push({
            raceNumber: i,
            winnerSnailId: SNAILS[randomIndex].id,
        });
    }
    return results;
}
export function calculateVictories(raceResults) {
    const victories = {};
    SNAILS.forEach((snail) => {
        victories[snail.id] = 0;
    });
    raceResults.forEach((race) => {
        victories[race.winnerSnailId] = (victories[race.winnerSnailId] || 0) + 1;
    });
    return victories;
}
