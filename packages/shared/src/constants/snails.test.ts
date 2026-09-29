import { describe, it, expect } from 'vitest';
import { SNAILS, RACES_PER_DAY, generateDailyRaceResults, calculateVictories } from './snails';

type SnailId = (typeof SNAILS)[number]['id'];

describe('Snail Constants', () => {
  describe('SNAILS', () => {
    it('should have 6 snails', () => {
      expect(SNAILS.length).toBe(6);
    });

    it('should have unique ids', () => {
      const ids = SNAILS.map(s => s.id);
      expect(new Set(ids).size).toBe(6);
    });

    it('should have names', () => {
      SNAILS.forEach(snail => {
        expect(snail.name).toBeTruthy();
        expect(typeof snail.name).toBe('string');
      });
    });
  });

  describe('RACES_PER_DAY', () => {
    it('should be 6', () => {
      expect(RACES_PER_DAY).toBe(6);
    });
  });

  describe('generateDailyRaceResults', () => {
    it('should generate 6 races', () => {
      const results = generateDailyRaceResults();
      expect(results.length).toBe(6);
    });

    it('should have race numbers 1-6', () => {
      const results = generateDailyRaceResults();
      const raceNumbers = results.map(r => r.raceNumber).sort((a, b) => a - b);
      expect(raceNumbers).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should have valid snail ids as winners', () => {
      const results = generateDailyRaceResults();
      const validIds = new Set(SNAILS.map(s => s.id));
      results.forEach(race => {
        // race.winnerSnailId is typed as string but we know it's a valid SnailId
        expect(validIds.has(race.winnerSnailId as SnailId)).toBe(true);
      });
    });
  });

  describe('calculateVictories', () => {
    it('should count victories correctly', () => {
      const results: Array<{ raceNumber: number; winnerSnailId: SnailId }> = [
        { raceNumber: 1, winnerSnailId: 'snail-1' },
        { raceNumber: 2, winnerSnailId: 'snail-1' },
        { raceNumber: 3, winnerSnailId: 'snail-2' },
        { raceNumber: 4, winnerSnailId: 'snail-3' },
        { raceNumber: 5, winnerSnailId: 'snail-3' },
        { raceNumber: 6, winnerSnailId: 'snail-3' },
      ];

      const victories = calculateVictories(results);
      expect(victories['snail-1']).toBe(2);
      expect(victories['snail-2']).toBe(1);
      expect(victories['snail-3']).toBe(3);
      expect(victories['snail-4']).toBe(0);
      expect(victories['snail-5']).toBe(0);
      expect(victories['snail-6']).toBe(0);
    });

    it('should include all snails with 0 victories', () => {
      const results: Array<{ raceNumber: number; winnerSnailId: SnailId }> = [
        { raceNumber: 1, winnerSnailId: 'snail-1' },
      ];

      const victories = calculateVictories(results);
      SNAILS.forEach(snail => {
        expect(victories[snail.id]).toBeDefined();
      });
    });
  });
});